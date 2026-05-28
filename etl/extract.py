import requests
import os
from dotenv import load_dotenv
import json
import pandas as pd

load_dotenv()
#39	7293

API = os.getenv("FOOTBALL_API")
url = os.getenv("BASE_URL")

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

            response = requests.request("GET",url=url,headers=headers,params=params,)

            return response
        
        except Exception as e:
            raise e

if __name__ == '__main__':
    from transform import Build
    data = Fetch(39,2024).fetch_fixtures().json()
    res = Build(data).points_table()
    print(res)

