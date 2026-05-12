from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import login_user, logout_user, register_user, user_profile

urlpatterns = [
    path("register/", register_user),
    path("login/", login_user),
    path("refresh/", TokenRefreshView.as_view()),
    path("profile/", user_profile),
    path("logout/", logout_user),
]
