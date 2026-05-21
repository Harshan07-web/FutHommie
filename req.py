import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()
#39	7293

API = os.getenv("FOOTBALL_API")
url = os.getenv("BASE_URL")

def fetch_fixtures(league_id : int,season : int):
    params = {
        "league" : league_id,
        "season" : season
    }

    headers = {
        'x-apisports-key' : API
    }

    response = requests.request("GET",url=url,headers=headers,params=params,)

    return response

json_data = fetch_fixtures(39,2024).json()



tot_matches = json_data["results"]
print(tot_matches)

for i in range(tot_matches):
    print(f"{json_data['response'][i]['teams']['home']['name']}")
    print(f"{json_data['response'][i]['teams']['away']['name']}")
    if json_data['response'][i]['teams']['home']['winner']:
        print(f"Winner : {json_data['response'][i]['teams']['home']['name']}")
    else:
        print(f"Winner : {json_data['response'][i]['teams']['away']['name']}")
