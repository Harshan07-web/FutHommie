import requests
import os
from dotenv import load_dotenv
import json
import pandas as pd

load_dotenv()
#39	7293

FOOTBALL_API = os.getenv("FOOTBALL_API")
url = os.getenv("BASE_URL")
team_url = os.getenv("TEAM_URL")
player_url = os.getenv("PLAYER_URL")
league_url = os.getenv("LEAGUE_URL")
venue_url = os.getenv("VENUES_URL")
topscorers_url = os.getenv("PLAYER_TOPSCORERS")
topassists_url = os.getenv("PLAYER_TOPASSISTS")
topyellow_url = os.getenv("PLAYER_YELLOW")
topred_url = os.getenv("PLAYER_RED")

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
                'x-apisports-key' : FOOTBALL_API
            }

            response = requests.request("GET",url=url,headers=headers,params=params)
            with open(f"data/raw/fixture_results_{self.league_id}_{self.season}.json","w") as f:
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
                'x-apisports-key' : FOOTBALL_API
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
                'x-apisports-key' : FOOTBALL_API
            }

            response = requests.request("GET",url=player_url+"/squads",headers=header,params=params)

            with open(f"data/raw/squad_{team_id}_results.json","w") as f:
                json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            raise e
        
    def fetch_venues(self,venue_id:int):
        try:
            param = {
                'id' : venue_id
            }

            header = {
                'x-apisports-key' : FOOTBALL_API
            }

            response = requests.request("GET" , url= venue_url,headers=header, params=param)
            with open(f"data/raw/venue_{venue_id}_results.json","w") as f:
                json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            raise e
        
    def fetch_leagues(self,league_id:int):
        try:
            param = {
                'id' : league_id
            }

            header = {
                'x-apisports-key' : FOOTBALL_API
            }

            response = requests.request("GET" , url= league_url,headers=header, params=param)
            with open(f"data/raw/league_{league_id}_results.json","w") as f:
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
                'x-apisports-key' : FOOTBALL_API
            }

            response = requests.request("GET",url=player_url,headers=header,params=params)

            with open(f"data/raw/player_{player_id}_details.json","w") as f:
                json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            raise e
        
    def fetch_topscorers(self):

        try:
            params = {
                'league' : self.league_id,
                'season' : self.season 
            }

            header = {
                'x-apisports-key' : FOOTBALL_API
            }

            response = requests.request("GET",url = topscorers_url ,headers=header,params=params)
            with open(f"data/raw/{self.league_id}_{self.season}_topscorers.json","w") as f:
                    json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            raise e
        
    def fetch_topassists(self):

        try:
            params = {
                'league' : self.league_id,
                'season' : self.season 
            }

            header = {
                'x-apisports-key' : FOOTBALL_API
            }

            response = requests.request("GET",url = topassists_url ,headers=header,params=params)
            with open(f"data/raw/{self.league_id}_{self.season}_topassists.json","w") as f:
                    json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            raise e
        
    def fetch_topyellow(self):

        try:
            params = {
                'league' : self.league_id,
                'season' : self.season 
            }

            header = {
                'x-apisports-key' : FOOTBALL_API
            }

            response = requests.request("GET",url = topyellow_url ,headers=header,params=params)
            with open(f"data/raw/{self.league_id}_{self.season}_topassists.json","w") as f:
                    json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            raise e
        
    def fetch_topred(self):

        try:
            params = {
                'league' : self.league_id,
                'season' : self.season 
            }

            header = {
                'x-apisports-key' : FOOTBALL_API
            }

            response = requests.request("GET",url = topred_url ,headers=header,params=params)
            with open(f"data/raw/{self.league_id}_{self.season}_topassists.json","w") as f:
                    json.dump(response.json(),f,indent=5)

            return response

        except Exception as e:
            raise e


if __name__ == '__main__':
    from transform import Build
    data = Fetch(39,2024).fetch_fixtures().json()
    res = Build(data).points_table()
    print(res)

