import requests
from django.conf import settings


def generate_ai_text(prompt):
    if not settings.OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY Render backend environment me set nahi hai.")

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": settings.OPENROUTER_SITE_URL,
        "X-OpenRouter-Title": settings.OPENROUTER_APP_NAME,
    }
    payload = {
        "model": settings.OPENROUTER_MODEL,
        "max_tokens": settings.OPENROUTER_MAX_TOKENS,
        "messages": [
            {"role": "user", "content": prompt},
        ],
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=60,
    )

    try:
        data = response.json()
    except ValueError as exc:
        raise RuntimeError(f"OpenRouter invalid response: {response.text[:500]}") from exc

    if response.status_code >= 400:
        message = data.get("error", {}).get("message") or data.get("message") or response.text
        raise RuntimeError(f"OpenRouter failed ({response.status_code}): {message}")

    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    if not content:
        raise RuntimeError("OpenRouter ne empty response diya. Model access, balance, ya provider status check karo.")

    return content
