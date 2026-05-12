from django.urls import path
from .views import get_jobs

urlpatterns = [
    path("jobs/", get_jobs),
]