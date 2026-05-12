from django.urls import path
from .views import resume_chatbot

urlpatterns=[
    path("chat/",resume_chatbot),
]