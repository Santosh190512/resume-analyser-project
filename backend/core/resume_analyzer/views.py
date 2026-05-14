import re
from io import BytesIO

from django.http import FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.conf import settings

from .models import Resume
from .utils import extract_text
from core.ai_client import generate_ai_text

MAX_RESUME_TEXT_CHARS = 12000


def extract_score(analysis):
    match = re.search(r"(\d{1,3})\s*/\s*100|(\d{1,3})\s*%", analysis)

    if not match:
        return None

    return min(int(match.group(1) or match.group(2)), 100)


def generate_improved_resume(resume_text):
    prompt = f"""
    Rewrite this resume into a polished ATS-friendly resume.

    Rules:
    - Keep the person's real details from the resume.
    - Improve wording, formatting, summary, skills, projects, and experience.
    - Use clear section headings.
    - Add measurable impact only when it is reasonable from the content.
    - Do not invent fake companies, degrees, or dates.

    Resume:
    {resume_text}
    """

    return generate_ai_text(prompt)


def build_resume_pdf(text):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=42,
        leftMargin=42,
        topMargin=42,
        bottomMargin=42,
    )
    styles = getSampleStyleSheet()
    story = []

    for line in text.splitlines():
        cleaned = line.strip()

        if not cleaned:
            story.append(Spacer(1, 10))
            continue

        style = styles["Heading2"] if cleaned.isupper() or cleaned.endswith(":") else styles["BodyText"]
        story.append(Paragraph(cleaned.replace("&", "&amp;"), style))
        story.append(Spacer(1, 6))

    doc.build(story)
    buffer.seek(0)
    return buffer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_resume(request):
    if not settings.OPENROUTER_API_KEY:
        return Response(
            {"error": "OPENROUTER_API_KEY Render backend environment me set nahi hai."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    resume_file = request.FILES.get("resume")

    if not resume_file:
        return Response(
            {"error": "Please upload a resume file using the field name 'resume'."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    resume = Resume.objects.create(
        user=request.user,
        file=resume_file,
    )

    try:
        text = extract_text(resume.file.path)
    except ValueError as exc:
        return Response(
            {"error": str(exc)},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as exc:
        return Response(
            {"error": f"Resume file read failed: {exc}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not text:
        return Response(
            {"error": "Could not read text from this resume."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    text = text[:MAX_RESUME_TEXT_CHARS]

    prompt = f"""
    Analyze this resume.

    Give:
    1. Resume Score out of 100
    2. Skills
    3. Missing Skills
    4. Improvements
    5. Recommended Job Roles
    6. ATS Analysis

    Resume:
    {text}
    """

    try:
        analysis = generate_ai_text(prompt)
        improved_resume = generate_improved_resume(text)
    except Exception as exc:
        return Response(
            {"error": f"OpenRouter analysis failed: {exc}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    resume.analysis = analysis
    resume.improved_resume = improved_resume
    resume.score = extract_score(analysis)
    resume.save(update_fields=["analysis", "improved_resume", "score"])

    return Response({
        "id": resume.id,
        "analysis": resume.analysis,
        "score": resume.score,
        "download_url": f"/api/resume/{resume.id}/download-improved/",
        "uploaded_at": resume.uploaded_at,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def resume_history(request):
    resumes = Resume.objects.filter(user=request.user).order_by("-uploaded_at")

    return Response({
        "total": resumes.count(),
        "latest_score": resumes.first().score if resumes.exists() else None,
        "resumes": [
            {
                "id": resume.id,
                "file_name": resume.file.name.split("/")[-1],
                "score": resume.score,
                "analysis": resume.analysis,
                "download_url": f"/api/resume/{resume.id}/download-improved/",
                "uploaded_at": resume.uploaded_at,
            }
            for resume in resumes
        ],
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_improved_resume(request, resume_id):
    try:
        resume = Resume.objects.get(id=resume_id, user=request.user)
    except Resume.DoesNotExist:
        return Response(
            {"error": "Resume not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if not resume.improved_resume:
        return Response(
            {"error": "Improved resume is not available for this upload."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    pdf = build_resume_pdf(resume.improved_resume)
    filename = f"improved_resume_{resume.id}.pdf"

    return FileResponse(
        pdf,
        as_attachment=True,
        filename=filename,
        content_type="application/pdf",
    )
