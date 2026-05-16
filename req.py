import requests
import os
from dotenv import load_dotenv

load_dotenv()
#39	7293

API = os.getenv("FOOTBALL_API")
url = os.getenv("BASE_URL")

def fetch_match(league_id : int,season : int):
    params = {
        "league" : league_id,
        "season" : season
    }

    headers = {
        'x-apisports-key' : API
    }

    response = requests.request("GET",url=url,headers=headers,params=params,)

    return response

fetch_match(39,2024)