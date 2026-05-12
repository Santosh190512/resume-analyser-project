from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


@api_view(["POST"])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    tokens = get_tokens_for_user(user)

    return Response(
        {
            "message": "Registration successful.",
            "access": tokens["access"],
            "refresh": tokens["refresh"],
            "user": UserSerializer(user).data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
def login_user(request):
    username = request.data.get("username") or request.data.get("email")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username/email and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    login_username = username

    if "@" in username:
        user_match = User.objects.filter(email__iexact=username).first()
        if user_match:
            login_username = user_match.username

    user = authenticate(username=login_username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid login details."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    tokens = get_tokens_for_user(user)

    return Response({
        "message": "Login successful.",
        "access": tokens["access"],
        "refresh": tokens["refresh"],
        "user": UserSerializer(user).data,
    })


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user

    if request.method == "PUT":
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.email = request.data.get("email", user.email)
        user.save()

    return Response({"user": UserSerializer(user).data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    return Response({"message": "Logout successful."})
