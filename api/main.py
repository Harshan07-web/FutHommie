from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
import json

from database.fixture_models import OverallStanding, HomeStanding, AwayStanding, Teams, Venues, Squad, League, PlayerInfo
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
        db.query(OverallStanding, Teams.logo)
        .join(
            Teams,
            Teams.team_id == OverallStanding.team_id
        )
        .filter(OverallStanding.season == season)
        .filter(OverallStanding.league_id == league_id)
        .order_by(OverallStanding.rank)
        .all()
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No data found for season {season}"
        )

    return [
        {
            "team_id": standing.team_id,
            "rank": standing.rank,
            "team": standing.team,
            "played": standing.played,
            "wins": standing.wins,
            "draws": standing.draws,
            "losses": standing.losses,
            "goal_diff": standing.goal_diff,
            "points": standing.points,
            "logo": logo
        }
        for standing, logo in results
    ]

@app.get("/fetch_home_table/{season}/{league_id}")
def fetch_home_table(season: int, league_id : int , db: Session = Depends(get_db)):
    results = (
        db.query(HomeStanding, Teams.logo)
        .join(
            Teams,
            Teams.team_id == HomeStanding.team_id
        )
        .filter(HomeStanding.season == season)
        .filter(HomeStanding.league_id == league_id)
        .order_by(HomeStanding.rank)
        .all()
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No data found for season {season}"
        )

    return [
        {
            "team_id": standing.team_id,
            "rank": standing.rank,
            "team": standing.team,
            "played": standing.played,
            "wins": standing.wins,
            "draws": standing.draws,
            "losses": standing.losses,
            "goal_diff": standing.goal_diff,
            "points": standing.points,
            "logo": logo
        }
        for standing, logo in results
    ]

@app.get("/fetch_away_table/{season}/{league_id}")
def fetch_away_table(season: int,league_id : int, db: Session = Depends(get_db)):
    results = (
        db.query(AwayStanding, Teams.logo)
        .join(
            Teams,
            Teams.team_id == AwayStanding.team_id
        )
        .filter(AwayStanding.season == season)
        .filter(AwayStanding.league_id == league_id)
        .order_by(AwayStanding.rank)
        .all()
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No data found for season {season}"
        )

    return [
        {
            "team_id": standing.team_id,
            "rank": standing.rank,
            "team": standing.team,
            "played": standing.played,
            "wins": standing.wins,
            "draws": standing.draws,
            "losses": standing.losses,
            "goal_diff": standing.goal_diff,
            "points": standing.points,
            "logo": logo
        }
        for standing, logo in results
    ]

@app.get("/fetch_team_performance/{season}/{team_id}")
def fetch_team_performance(team_id : int , season:int, db : Session = Depends(get_db)):
    team_exists = (
        db.query(OverallStanding)
        .filter(OverallStanding.season==season)
        .filter(func.lower(OverallStanding.team_id)==team_id)
        .first()
    )

    if not team_exists:
        raise HTTPException(status_code=404, detail=f"Team with the name {team_id} was not found")
    
    return team_exists

@app.get("/fetch_top_teams/{season}/{n}")
def get_top_teams(season : int , n : int , db : Session = Depends(get_db)):
    if n <= 0 or n > 20:
        raise HTTPException(status_code=400, detail="n must be between 1 and 20")

    top_teams = (
        db.query(OverallStanding)
        .filter(OverallStanding.season == season)
        .order_by(OverallStanding.rank)
        .limit(n)
    ).all()

    if not top_teams:
        raise HTTPException(status_code=404, detail="team details doesnt exist")

    return top_teams
    
@app.get("/fetch_team_details/{team_id}")
def fetch_team_details(team_id: int, db : Session = Depends(get_db)):

    team_exists = (
        db.query(Teams)
        .filter(Teams.team_id==team_id)
        .first()
    )

    if not team_exists:
        raise HTTPException(status_code=404, detail=f"Team with the name {team_id} was not found")
    
    return team_exists

@app.get("/teams/{league_id}")
def get_teams_by_league(league_id: int, db: Session = Depends(get_db)):

    teams = db.query(Teams).filter(Teams.league_id == league_id).all()

    return teams
@app.get("/fetch_all_venues")
def fetch_all_venues(db : Session = Depends(get_db)):
    venues = (
        db.query(
        Venues.venue_id,
        Venues.name,
        Teams.logo,
        Teams.venue_id
    ).outerjoin(
        Teams, Venues.venue_id == Teams.venue_id
    ).distinct(Teams.team_id)
    .all()
    )

    return [
        {
        "venue_id" : venue.venue_id,
        "name" : venue.name,
        "logo" : venue.logo,
        }
        for venue in venues
    ]

@app.get("/fetch_venue_details/{venue_id}")
def fetch_venue_details(venue_id : int, db : Session = Depends(get_db)):
    venue = db.query(Venues).filter(Venues.venue_id==venue_id).first()

    if not venue:
        raise HTTPException(status_code=404, detail=f"{venue_id} not found !")
    
    return venue

@app.get("/all_teams")
def get_all_teams(db:Session = Depends(get_db)):
    teams = db.query(Teams).all()

    if not teams:
        raise HTTPException(status_code=404, detail=f"No teams found to display")
    
    return teams

@app.get("/fetch_teams/{league_id}/{season}")
def fetch_season_teams(league_id : int , season : int , db : Session = Depends(get_db)):
    teams = db.query(Teams).filter(Teams.league_id==league_id).filter(Teams.season==season).all()

    if not teams:
        raise HTTPException(status_code=404, detail=f"No teams found to display")
    
    return teams

@app.get("/fetch_squads/{team_id}")
def fetch_squads(team_id : int, db : Session = Depends(get_db)):
    squads = db.query(Squad).filter(Squad.team_id==team_id).all()

    if not squads:
        raise HTTPException(status_code=404,detail=f"SQUAD for {team_id} not found")
    
    return squads

@app.get("/fetch_leagues")
def fetch_all_leagues(db : Session = Depends(get_db)):
    leagues = db.query(League).all()

    if not leagues:
        raise HTTPException(status_code=404, detail= "Leagues not found")

    return leagues

@app.get("/fetch_league/{league_id}")
def featch_league(league_id : int, db : Session = Depends(get_db)):
    league = db.query(League).filter(League.league_id==league_id).first()

    if not league:
        raise HTTPException(status_code=404,detail=f"league not found for {league_id}")
    
    return league

@app.get("/fetch_player/{player_id}")
def fetch_player(player_id: int, db: Session = Depends(get_db)):
    player = db.query(PlayerInfo).filter(PlayerInfo.player_id == player_id).first()

    if not player:
        raise HTTPException(status_code=404, detail=f"Player not found for {player_id}")
    
    return player


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://football-data-hub.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)