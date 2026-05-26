from fastapi import FastAPI
from pydantic import BaseModel
import json

from etl.extract import Fetch
from etl.transform import Build

app = FastAPI()

class FetchRequest(BaseModel):
    league_id : int
    season : int

# league_id = 39 #pl
# season = 2024


@app.get("/")
def home():
    return {
        "msg" : "fast api running"
    }

@app.post("/fetch_overall_table")
def fetch_table(payload : FetchRequest):
    response = Fetch(payload.league_id,payload.season).fetch_fixtures()
    json_data = response.json()

    table = Build(json_data).points_table()

    return table.to_dict(orient='records')

@app.post("/fetch_home_table")
def fetch_home_table(payload : FetchRequest):
    response = Fetch(payload.league_id,payload.season).fetch_fixtures()
    json_data = response.json()

    home_table = Build(json_data).home_points_table()

    return home_table.to_dict(orient='records')

@app.post("/fetch_away_table")
def fetch_away_table(payload : FetchRequest):
    response = Fetch(payload.league_id,payload.season).fetch_fixtures()
    json_data = response.json()

    away_table = Build(json_data).away_points_table()

    return away_table.to_dict(orient='records')




