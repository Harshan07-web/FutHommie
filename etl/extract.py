import requests
import os
from dotenv import load_dotenv
import json
import pandas as pd

load_dotenv()
#39	7293

API = os.getenv("FOOTBALL_API")
url = os.getenv("BASE_URL")
team_url = os.getenv("TEAM_URL")
player_url = os.getenv("PLAYER_URL")

class Fetch:
    def __init__(self,league_id:int,season:int):
        self.league_id = league_id
        self.season = season

    def fetch_fixtures(self):
        try:
            params = {
                "league" : self.league_id,
                "season" : self.season
            }

            headers = {
                'x-apisports-key' : API
            }

            response = requests.request("GET",url=url,headers=headers,params=params)
            with open("data/raw/fixture_results.json","w") as f:
                json.dump(response.json(),f,indent=5)

            return response
        
        except Exception as e:
            raise e
        
    def fetch_teams(self):
        try:
            params = {
                "league" : self.league_id,
                "season" : self.season
            }

            headers = {
                'x-apisports-key' : API
            }

            response = requests.request("GET", url=team_url,headers=headers,params=params)

            with open("data/raw/team_results.json","w") as f:
                json.dump(response.json(),f,indent=5)

            return response
        except Exception as e:
            raise e
        
    def fetch_squad(self,team_id : int):
        try:
            params = {
                "team" : team_id
            }

            header = {
                'x-apisports-key' : API
            }

            response = requests.request("GET",url=player_url,headers=header,params=params)

            with open("data/raw/squad_results.json","w") as f:
                json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            raise e
        
    def fetch_player_details(self,player_id:int):
        try:
            params = {
                'player' : player_id
            }

            header = {
                'x-apisports-key' : API
            }

            response = requests.request("GET",url=player_url,headers=header,params=params)

            with open("data/raw/player_details.json","w") as f:
                json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            raise e


if __name__ == '__main__':
    from transform import Build
    data = Fetch(39,2024).fetch_fixtures().json()
    res = Build(data).points_table()
    print(res)

