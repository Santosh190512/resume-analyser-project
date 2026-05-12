import requests

from django.conf import settings



def fetch_jobs(skill, location):

    url = "https://jsearch.p.rapidapi.com/search"

    querystring = {
        "query": f"{skill} jobs in {location}",
        "page": "1",
        "num_pages": "1"
    }

    headers = {
        "X-RapidAPI-Key": settings.RAPID_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    response = requests.get(
        url,
        headers=headers,
        params=querystring
    )

    response.raise_for_status()

    return response.json()
