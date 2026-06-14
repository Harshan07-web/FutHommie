from etl.extract import Fetch
from etl.transform import Build
import time
import json
import os
import logging
from datetime import date


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


os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

logger = logging.getLogger("etl")
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler(LOG_FILE)
file_handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(message)s"))
logger.addHandler(file_handler)

console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
logger.addHandler(console_handler)

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            state = json.load(f)
    else:
        state = {"date": None, "requests_used": 0, "completed": [], "teams_to_process": []}

    today = str(date.today())
    if state.get("date") != today:
        state["date"] = today
        state["requests_used"] = 0

    state["completed"] = set(state.get("completed", []))
    state.setdefault("teams_to_process", [])
    return state


def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    to_save = dict(state)
    to_save["completed"] = list(state["completed"])
    with open(STATE_FILE, "w") as f:
        json.dump(to_save, f, indent=2)


class BudgetExceeded(Exception):
    pass


def make_request(state, task_key, func, *args, **kwargs):
    if task_key in state["completed"]:
        logger.info(f"Skipping (already done): {task_key}")
        return None

    if state["requests_used"] >= DAILY_REQUEST_LIMIT:
        raise BudgetExceeded(f"Daily limit of {DAILY_REQUEST_LIMIT} requests reached.")

    logger.info(f"Fetching: {task_key}")
    try:
        response = func(*args, **kwargs)
    except Exception as e:
        state["requests_used"] += 1
        save_state(state)
        logger.error(f"{task_key} raised an exception: {e}")
        return None

    state["requests_used"] += 1

    if response.status_code != 200:
        logger.error(f"{task_key} failed with status {response.status_code}")
        save_state(state)
        return None

    state["completed"].add(task_key)
    save_state(state)
    time.sleep(REQUEST_DELAY)
    return response


def main():
    state = load_state()
    logger.info(f"Run started. Requests used today: {state['requests_used']}/{DAILY_REQUEST_LIMIT}")

    try:
        for league_id, league_name in TOP5_LEAGUES.items():
            for season in SEASONS:
                task_key = f"fixtures_{league_id}_{season}"
                response = make_request(state, task_key, Fetch(league_id, season).fetch_fixtures)
                if response is None:
                    continue
                data = response.json()
                Build(data).points_table()
                Build(data).home_points_table()
                Build(data).away_points_table()
                logger.info(f"Processed fixtures: {league_name} {season}")

        for league_id, league_name in COMPETITIONS.items():
            task_key = f"league_details_{league_id}"
            response = make_request(state, task_key, Fetch(league_id).fetch_leagues, league_id)
            if response is None:
                continue
            data = response.json()
            Build(data).league_table()
            logger.info(f"Processed league details: {league_name}")

        known_team_ids = {t["team_id"] for t in state["teams_to_process"]}

        for league_id, league_name in TOP5_LEAGUES.items():
            task_key = f"teams_{league_id}_{TEAM_DISCOVERY_SEASON}"
            response = make_request(state, task_key, Fetch(league_id, TEAM_DISCOVERY_SEASON).fetch_teams)
            if response is None:
                continue
            data = response.json()
            Build(data).team_table()
            logger.info(f"Processed team list: {league_name}")

            for entry in data.get("response", []):
                team_id = entry["team"]["id"]
                if team_id not in known_team_ids:
                    state["teams_to_process"].append({
                        "team_id": team_id,
                        "venue_id": entry["venue"]["id"],
                    })
                    known_team_ids.add(team_id)

        save_state(state)

        # for team in state["teams_to_process"]:
        #     team_id = team["team_id"]
        #     venue_id = team["venue_id"]

        #     squad_key = f"squad_{team_id}"
        #     response = make_request(state, squad_key, Fetch(0, TEAM_DISCOVERY_SEASON).fetch_squad, team_id)
        #     if response is not None:
        #         Build(response.json()).squad_table()
        #         logger.info(f"Processed squad: team {team_id}")

        #     venue_key = f"venue_{venue_id}"
        #     response = make_request(state, venue_key, Fetch(0, TEAM_DISCOVERY_SEASON).fetch_venues, venue_id)
        #     if response is not None:
        #         Build(response.json()).venue_table()
        #         logger.info(f"Processed venue: {venue_id}")

    except BudgetExceeded as e:
        logger.warning(str(e))
        logger.info("Stopping for today — re-run to continue where this left off.")
        return

    logger.info(f"Run complete. Requests used today: {state['requests_used']}/{DAILY_REQUEST_LIMIT}")


if __name__ == "__main__":
    main()


