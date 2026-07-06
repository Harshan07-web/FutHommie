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
            "limit" : 30
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

     def fetch_standings(self,id:int,season:int):
        standings_url = f"https://api.football-data.org//v4/competitions/{id}/standings"
        try:
            headers = {
            "X-Auth-Token": API
        }

            params = {
            "season": season,
        }

            response = requests.get(
                url = standings_url,
                headers=headers,
                params=params
            )

            print(response.status_code)

            with open(f"data/raw/{id}_season_{season}_standings.json","w") as f:
                    json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            print(e)

     def fetch_league_matches(self,id:int,season:int):
        url = f"https://api.football-data.org/v4/competitions/{id}/matches"
        params = {
            'season' : season
        }

        headers = {
        "X-Auth-Token": API
        }

        res = requests.request("GET",url=url,params=params,headers=headers)

        print(res.status_code)
        with open(f"data/raw/{id}_league_{season}_matches.json","w") as f:
                json.dump(res.json(),f,indent=5)

        return res

     def fetch_league_teams(self,id:int,season:int):
        url = f"https://api.football-data.org/v4/competitions/{id}/teams"
        params = {
            'season' : season
        }

        headers = {
        "X-Auth-Token": API
        }

        res = requests.request("GET",url=url,params=params,headers=headers)

        print(res.status_code)
        with open(f"data/raw/{id}_league_{season}_teams.json","w") as f:
                json.dump(res.json(),f,indent=5)

        return res
     
     def fetch_league_scorers(self,id:int,season:int):
        url = f"https://api.football-data.org/v4/competitions/{id}/scorers"
        params = {
            'season' : season,
            'limit' : 20
        }

        headers = {
        "X-Auth-Token": API
        }

        res = requests.request("GET",url=url,params=params,headers=headers)

        print(res.status_code)
        with open(f"data/raw/{id}_league_{season}_scorers.json","w") as f:
                json.dump(res.json(),f,indent=5)

        return res
     

if __name__=='__main__':
     res = Fetch_2().fetch_standings(2025)
    
