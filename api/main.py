from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
import json

from database.fixture_models import OverallStanding, HomeStanding, AwayStanding, Teams
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

@app.get("/standings/{season}/{league_id}")
def get_overall_standings(season: int,league_id :int, db: Session = Depends(get_db)):
    results = (
        db.query(OverallStanding)
        .filter(OverallStanding.season == season)
        .filter(OverallStanding.league_id == league_id)
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

@app.get("/fetch_team_performance/{season}/{name}")
def fetch_team_data(name: str, season:int, db : Session = Depends(get_db)):
    team = name.strip().lower()
    team_exists = (
        db.query(OverallStanding)
        .filter(OverallStanding.season==season)
        .filter(func.lower(OverallStanding.team)==team)
        .first()
    )

    if not team_exists:
        raise HTTPException(status_code=404, detail=f"Team with the name {name} was not found")
    
    return team_exists

@app.get("/fetch_top_teams/{season}/{n}")
def get_top_teams(season : int , n : int , db : Session = Depends(get_db)):
    if n>20:
        raise HTTPException(status_code=500, detail="Only 20 teams available")
    top_teams = (
        db.query(OverallStanding)
        .filter(OverallStanding.season==Session)
        .order_by(OverallStanding.rank)
        .limit(n)
    )

    if not top_teams:
        raise HTTPException(status_code=404,detail="team details doesnt exist")
    

@app.get("/fetch_teams/{season}/{league_id}")
def get_league_teams(season:int , league_id:int , db : Session = Depends(get_db)):
    teams = (
            db.query(Teams)
            .filter(Teams.season==season)
            .filter(Teams.league_id==league_id)
            .all()
            )
    
    if not teams:
        raise HTTPException(status_code=500,detail="Internal server error,no teams to fetch")
    
    return teams