from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from database.fixture_models import OverallStanding, HomeStanding, AwayStanding
from database.database import get_db

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

@app.get("/standings/{season}")
def get_overall_standings(season: int, db: Session = Depends(get_db)):
    results = (
        db.query(OverallStanding)
        .filter(OverallStanding.season == season)
        .order_by(OverallStanding.rank)
        .all()
    )
    if not results:
        raise HTTPException(status_code=404, detail=f"No data found for season {season}")
    return results

@app.get("/fetch_home_table/{season}")
def fetch_home_table(season: int, db: Session = Depends(get_db)):
    results = (
        db.query(HomeStanding)
        .filter(HomeStanding.season == season)
        .order_by(HomeStanding.rank)
        .all()
    )

    if not results:
        raise HTTPException(status_code=400, detail=f"data doesnt exist in the databse for season : {season}")
    return results

@app.get("/fetch_away_table/{season}")
def fetch_away_table(season: int, db: Session = Depends(get_db)):
    results = (
        db.query(AwayStanding)
        .filter(AwayStanding.season == season)
        .order_by(AwayStanding.rank)
        .all()
    )

    if not results:
        raise HTTPException(status_code=400, detail=f"data doesnt exist in the databse for season : {season}")
    return results

