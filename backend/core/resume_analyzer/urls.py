from django.urls import path
from .views import analyze_resume, download_improved_resume, resume_history

urlpatterns = [
    path("analyze/", analyze_resume),
    path("history/", resume_history),
    path("<int:resume_id>/download-improved/", download_improved_resume),
]
