from etl.extract import Fetch
from etl.extract_2 import Fetch_2
from etl.transform import Build
import time
import json
import os
import logging
from datetime import date

from database.fixture_models import Teams, OverallStanding, Venues, Squad, PlayerInfo, Fixtures, PlayerLeaderBoard
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

STATE_FILE = r"D:\Football\data\raw\state.json"
LOG_FILE = r"D:\Football\logs\pipeline.log"
visited_venues = set()
visited_teams = set()
visited_leagues = set()
visited_players = set()
visited_fixtures = set()

def fixture_exists(league_id,season):
    try:
        db = session()
        exists = (
            db.query(Fixtures)
            .filter(Fixtures.league_id==league_id)
            .filter(Fixtures.season==season)
            .first()
        )

        return exists
    finally:
        db.close()

def run_fetch_fixtures():
    for league_id,league_name in COMPETITIONS.items():
        print(f"fetching for {league_name}")
        for i in SEASONS:
            print(f"season {i}")
            if fixture_exists(league_id,i):
                print(f"already exists {i} {league_id}")
                continue
            response = Fetch(league_id,i).fetch_fixtures()
            Build(response.json()).fixtures_table()
            print(f"stored season{i}")
            time.sleep(10)
            

def run_fetch_fixture_build_table():
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

def run_player_details_fetch():
    db = session()
    try:
        player_ids = db.query(Squad.player_id).all()
        existing_player = db.query(PlayerInfo.player_id).all()
        for player in existing_player:
            visited_players.add(player[0])
        for player in player_ids:
            player_id = player[0]
            if player_id in visited_players:
                print(f"player {player_id} already exists")
                continue
            print(f"fetching player detail for {player_id}")
            response = Fetch(0,0).fetch_player_details(player_id=player_id)
            Build(response.json()).player_details_table()
            print(f"Stored player {player_id}")
            time.sleep(10)
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

LEADERBOARD_STATE_FILE = r"D:\Football\data\raw\leaderboard_state.json"

def _load_leaderboard_state():
    if os.path.exists(LEADERBOARD_STATE_FILE):
        with open(LEADERBOARD_STATE_FILE) as f:
            return json.load(f)
    return {}

def _save_leaderboard_state(state):
    os.makedirs(os.path.dirname(LEADERBOARD_STATE_FILE), exist_ok=True)
    with open(LEADERBOARD_STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def leaderboard_complete(state, league_id, season, league_type):
    key = f"{league_type}:{league_id}:{season}"
    return state.get(key, False)

def mark_leaderboard_complete(state, league_id, season, league_type):
    key = f"{league_type}:{league_id}:{season}"
    state[key] = True
    _save_leaderboard_state(state)

def run_fetch_topscorer_leaderbaord():
    state = _load_leaderboard_state()
    for league_id,league_name in COMPETITIONS.items():
        print(f"fetching for {league_name}")
        for i in SEASONS:
            if (league_id==528 and i==2023) or (league_id==15 and i==2024):
                continue
            print(f"season {i}")
            if leaderboard_complete(state,league_id,i,"topscorer"):
                print(f"already exists {i} {league_id}")
                continue
            response = Fetch(league_id,i).fetch_topscorers()
            print("resposnse fetched")
            Build(response.json()).player_leaderboard("topscorer")
            print("table built")
            mark_leaderboard_complete(state,league_id,i,"topscorer")
            print(f"stored season{i}")
            time.sleep(10)

def run_fetch_topassists_leaderbaord():
    state = _load_leaderboard_state()
    for league_id,league_name in COMPETITIONS.items():
        print(f"fetching for {league_name}")
        for i in SEASONS:
            if (league_id==528 and i==2023) or (league_id==15 and i==2024):
                continue
            print(f"season {i}")
            if leaderboard_complete(state,league_id,i,"topassists"):
                print(f"already exists {i} {league_id}")
                continue
            response = Fetch(league_id,i).fetch_topassists()
            Build(response.json()).player_leaderboard("topassists")
            mark_leaderboard_complete(state,league_id,i,"topassists")
            print(f"stored season{i}")
            time.sleep(10)

def run_fetch_topyellow_leaderbaord():
    state = _load_leaderboard_state()
    for league_id,league_name in COMPETITIONS.items():
        print(f"fetching for {league_name}")
        for i in SEASONS:
            if (league_id==528 and i==2023) or (league_id==15 and i==2024):
                continue
            print(f"season {i}")
            if leaderboard_complete(state,league_id,i,"topyellowcards"):
                print(f"already exists {i} {league_id}")
                continue
            response = Fetch(league_id,i).fetch_topyellow()
            Build(response.json()).player_leaderboard("topyellowcards")
            mark_leaderboard_complete(state,league_id,i,"topyellowcards")
            print(f"stored season{i}")
            time.sleep(10)

def run_fetch_topred_leaderbaord():
    state = _load_leaderboard_state()
    for league_id,league_name in COMPETITIONS.items():
        print(f"fetching for {league_name}")
        for i in SEASONS:
            if (league_id==528 and i==2023) or (league_id==15 and i==2024):
                continue
            print(f"season {i}")
            if leaderboard_complete(state,league_id,i,"topredcards"):
                print(f"already exists {i} {league_id}")
                continue
            response = Fetch(league_id,i).fetch_topred()
            Build(response.json()).player_leaderboard("topredcards")
            mark_leaderboard_complete(state,league_id,i,"topredcards")
            print(f"stored season{i}")
            time.sleep(10)

def run_dataorg_fetch_teams():
    print("Fetching World Cup Teams...")

    data = Fetch_2().fetch_teams(2026)
    Build(data.json()).dataorg_teams()
    Build(data.json()).dataorg_players()
    print("Stored teams and players.")


def run_dataorg_fetch_matches():
    print("Fetching World Cup Matches...")
    data = Fetch_2().fetch_matches(2026)
    Build(data.json()).dataorg_matches()
    Build(data.json()).dataorg_competition()
    print("Stored competition and matches.")
    return data

def run_dataorg_fetch_tscorers():
    print("Fetching World Cup top scorers...")
    data = Fetch_2().fetch_top_scorer(2026)
    Build(data.json()).dataorg_scorers()
    print("Stored competition and matches.")
    return data



def run_player_details_fetch_capped(max_requests=16):
    db = session()
    try:
        to_check_players = {row[0] for row in db.query(PlayerLeaderBoard.player_id).all()}
        visited_player_det = {row[0] for row in db.query(PlayerInfo.player_id).all()}
    finally:
        db.close()

    no_of_requests = 0
    for player_id in to_check_players:
        if player_id in visited_player_det:
            print(f"Player {player_id} exists, skipping")
            continue
        if no_of_requests >= max_requests:
            print(f"Hit request cap ({max_requests}), stopping")
            break
        print(f"fetching for player {player_id}")
        try:
            res = Fetch(0, 0).fetch_player_details(player_id)
            Build(res.json()).player_details_table()
            no_of_requests += 1
            print(f"Stored for player {player_id}")
            time.sleep(7)
        except Exception as e:
            # don't let one bad player kill the whole capped batch
            print(f"Failed for player {player_id}: {e}")
            continue


if __name__ == '__main__':
    # run_player_details_fetch_capped(max_requests=16)

    # time.sleep(7)
    # run_dataorg_fetch_matches()
    # time.sleep(7)
    # run_dataorg_fetch_tscorers()

    # res = Fetch_2().fetch_standings(2000,2026)
    # Build(res.json()).dataorg_standings()
    # print(f"Fetching top scorer")
    # run_fetch_topscorer_leaderbaord()
    # time.sleep(5)
    print(f"Fetching top assists")
    run_fetch_topassists_leaderbaord()
    # time.sleep(5)
    # print(f"Fetching top yellow")
    # run_fetch_topyellow_leaderbaord()
    # time.sleep(5)
    # print(f"Fetching top red")
    # run_fetch_topred_leaderbaord()

