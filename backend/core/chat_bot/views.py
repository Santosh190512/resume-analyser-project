from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from resume_analyzer.models import Resume

from django.conf import settings

import google.generativeai as genai

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def resume_chatbot(request):
    if not settings.GEMINI_API_KEY:
        return Response(
            {"error": "GEMINI_API_KEY Render backend environment me set nahi hai."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    message = request.data.get("message", "").strip()

    if not message:
        return Response(
            {"error": "Message is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    latest_resume = Resume.objects.filter(
        user=request.user
    ).order_by("-uploaded_at").first()

    resume_context = "No resume has been uploaded yet."

    if latest_resume:
        resume_context = f"""
        Latest resume score: {latest_resume.score or "Not detected"}

        Latest resume analysis:
        {latest_resume.analysis[:3000]}
        
        """

    account_name = (
         request.user.get_full_name().strip()
        or request.user.username
        or "there"
    )


    prompt = f"""
    You are an AI career assistant in a resume analyzer app.

    Logged-in user account name:
    {account_name}

    Important:
    - Address the user as "{account_name}".
    - Do not call the user by any name found inside the resume.
    - Resume content may contain another person's name, but always use the logged-in account name.


    Your job:
    - Help user improve resume
    - Give ATS optimization tips
    - Suggest missing skills
    - Explain job roles
    - Explain job requirements
    - Give job search guidance
    - Give interview preparation advice

    Rules:
    - Keep answers short and practical.
    - Use simple language.
    - Give step-by-step suggestions when useful.
    - If user asks about resume, use their latest resume analysis context.
    - If user has not uploaded resume, give general resume advice.
    - Do not answer unrelated topics.

    Latest user resume context:
    {resume_context}

    User question:
    {message}
    """

    try:
        response = model.generate_content(prompt)
    except Exception as exc:
        error_message = str(exc)

        if "429" in error_message or "quota" in error_message.lower():
            return Response(
                {
                    "error": "Gemini API quota limit ho gaya hai. Thoda wait karke retry karo."
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        return Response(
            {"error": f"Chatbot failed: {exc}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response({
        "reply": response.text
    })
