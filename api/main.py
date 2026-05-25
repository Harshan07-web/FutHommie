from fastapi import FastAPI
from pydantic import BaseModel
import json

from etl.extract import fetch
from etl.transform import build

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

@app.post("/fetch")
def fetch_data(payload : FetchRequest):
    response = fetch(payload.league_id,payload.season).fetch_fixtures()
    json_data = response.json()

    table = build(json_data).build_data()

    return table.to_dict(orient='records')



