import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

API = os.getenv("DATAORGTOKEN")
matches_url = os.getenv("DATAORG_MATCHES_URL")
team_url = os.getenv("DATAORG_TEAMS_URL")
match_url = os.getenv("DATAORG_MATCH_URL")
top_scorer_url = os.getenv("DATAORG_TOP_SCORER")

os.makedirs("data/raw", exist_ok=True)


class Fetch_2:
     def __init__(self):
          pass
     
     def fetch_matches(self,season:int):
        try:
            headers = {
            "X-Auth-Token": API
        }

            params = {
            "season": season
        }

            response = requests.get(
                url = matches_url,
                headers=headers,
                params=params
            )

            print(response.status_code)

            with open(f"data/raw/1wc.json","w") as f:
                    json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            print(e)

     def fetch_teams(self,season:int):
        try:
            headers = {
            "X-Auth-Token": API
        }

            params = {
            "season": season
        }

            response = requests.get(
                url = team_url,
                headers=headers,
                params=params
            )

            print(response.status_code)

            with open(f"data/raw/1wc_teams.json","w") as f:
                    json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            print(e)


     def fetch_top_scorer(self,season:int):
        try:
            headers = {
            "X-Auth-Token": API
        }

            params = {
            "season": season,
            "limit" : 20
        }

            response = requests.get(
                url = top_scorer_url,
                headers=headers,
                params=params
            )

            print(response.status_code)

            with open(f"data/raw/1wc_top_scorer.json","w") as f:
                    json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            print(e)

if __name__ == '__main__':
    url = f"https://api.football-data.org/v4/competitions/{2021}/matches"
    params = {
        'season' : 2023
    }

    headers = {
    "X-Auth-Token": API
    }

    res = requests.request("GET",url=url,params=params,headers=headers)

    print(res.status_code)


    with open(f"data/raw/3premier_league_matches.json","w") as f:
            json.dump(res.json(),f,indent=5)
