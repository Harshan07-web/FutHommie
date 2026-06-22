from etl.extract import Fetch
from etl.transform import Build
import time
import json
import os
import logging
from datetime import date

from database.fixture_models import Teams, OverallStanding, Venues, Squad
from database.database import session


TOP5_LEAGUES = {
    39:  "Premier League",
    140: "La Liga",
    78:  "Bundesliga",
    135: "Serie A",
    61:  "Ligue 1",
}

COMPETITIONS = {
    39: "Premier League",
    45: "FA Cup",
    48: "Carabao Cup",
    528: "Community Shield",

    140: "La Liga",
    143: "Copa del Rey",
    556: "Spanish Super Cup",

    78: "Bundesliga",
    81: "DFB Pokal",
    529: "DFL Super Cup",

    135: "Serie A",
    137: "Coppa Italia",
    547: "Supercoppa Italiana",

    61: "Ligue 1",
    66: "Coupe de France",
    526: "Trophee des Champions",

    2: "UEFA Champions League",
    3: "UEFA Europa League",
    848: "UEFA Europa Conference League",
    531: "UEFA Super Cup",

    15: "FIFA Club World Cup"
}


SEASONS = [2022, 2023, 2024]
TEAM_DISCOVERY_SEASON = 2024
DAILY_REQUEST_LIMIT = 100
REQUEST_DELAY = 10          

STATE_FILE = r"D:\Football\data\raw\state.json"
LOG_FILE = r"D:\Football\logs\pipeline.log"
visited_venues = set()
visited_teams = set()
visited_leagues = set()

def run_fixture_fetch():
    for league_id, league_name in TOP5_LEAGUES.items():
        print(f"\nProcessing {league_name}")
        for season in SEASONS:
            print(f"Season {season}")
            fixture_data = (
                Fetch(
                    league_id=league_id,
                    season=season
                )
                .fetch_fixtures()
            )
            build = Build(fixture_data.json())
            build.points_table()
            build.home_points_table()
            build.away_points_table()
            time.sleep(10)

def run_league_info_fetch():
    for league_id,league_name in COMPETITIONS.items():
        print(f"Fetching {league_name} , {league_id} : ")
        league_data = Fetch(0,0).fetch_leagues(league_id)
        build = Build(league_data.json())
        build.league_table()
        print(f"Stored {league_name}")
        time.sleep(10)

def run_team_info_fetch():
    for league_id, league_name in COMPETITIONS.items():
        if league_id in visited_leagues:
            continue
        print(f"\nFetching teams for {league_name}")
        for season in SEASONS:
            team_data = (
                Fetch(
                    league_id=league_id,
                    season=season
                )
                .fetch_teams()
            )
            build = Build(team_data.json())
            build.team_table()
            print(f"Stored {league_name} for {season}")
            visited_leagues.add(league_id)
            time.sleep(10)

def run_venues_fetch():
    db = session()
    try:
        venue_ids = db.query(Teams.venue_id).all()
        v_id = db.query(Venues.venue_id).all()
        for venue in v_id:
            visited_venues.add(venue[0])
        for venue_tuple in venue_ids:
            venue_id = venue_tuple[0]
            if venue_id in visited_venues:
                continue

            print(f"Fetching venue {venue_id}")
            venue_data = (
                Fetch(
                    league_id=0,
                    season=0
                )
                .fetch_venues(venue_id)
            )
            build = Build(venue_data.json())
            build.venue_table()
            visited_venues.add(venue_id)
            print(f"stored {venue_id}")
            time.sleep(10)
    finally:
        db.close()

def run_squad_fetch():
    db = session()
    try:
        team_ids = db.query(Teams.team_id).all()
        existing_squad = db.query(Squad.team_id).distinct().all()
        for i in existing_squad:
            visited_teams.add(i[0])
        for team in team_ids:
            team_id = team[0]
            if team_id not in visited_teams:
                print(f"Fetching squad for {team_id}")
                response = Fetch(0,0).fetch_squad(team_id=team_id)
                Build(response.json()).squad_table()
                visited_teams.add(team_id)
                print(f"Store squads for {team_id}")
                time.sleep(10)
            else:
                print(f"{team_id} in visited teams, skipping..")
    except Exception as e:
        db.rollback()
        raise e

    finally:
        db.close()

if __name__ == '__main__':
    run_team_info_fetch()
    