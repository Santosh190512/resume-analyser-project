from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .services import fetch_jobs


@api_view(['GET'])
def get_jobs(request):
    skill = request.GET.get("skill")
    location = request.GET.get("location")

    if not skill:
        return Response(
            {"error": "skill query parameter is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not location:
        return Response(
            {"error": "location query parameter is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        jobs = fetch_jobs(skill, location)
    except ValueError as exc:
        return Response(
            {"error": str(exc)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as exc:
        return Response(
            {"error": f"Job search failed: {exc}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response(jobs)
