from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import path, include


def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("api/health/", health_check),

    path("api/auth/", include("accounts.urls")),

    path("api/resume/", include("resume_analyzer.urls")),

    path("api/job/", include("job_finder.urls")),

    path('api/chat_bot/',include("chat_bot.urls"))

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
