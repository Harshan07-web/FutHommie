from database.database import session
from database.fixture_models import OverallStanding, HomeStanding,AwayStanding , Teams


class StoreData:
    def __init__(self,table):
        self.table = table

    def overall_table(self):
        try:
            db = session()
            for index,row in self.table.iterrows():

                exists = (db.query(OverallStanding)
                        .filter(OverallStanding.season==row['season'], 
                                    OverallStanding.team==row['teams'])
                        .first()
                )

                if exists:
                    exists.team_id = row['team_id']
                    exists.league_id = row['league_id']
                    exists.league = row['league']
                    exists.season = row['season']
                    exists.rank = row['rank']
                    exists.team = row['teams']
                    exists.played = row['played']
                    exists.wins = row["wins"]
                    exists.draws = row["draws"]
                    exists.losses = row["losses"]
                    exists.goals = row["goals"]
                    exists.goals_conceded = row["goal con"]
                    exists.goal_diff = row["goal diff"]
                    exists.points = row["points"]
                    exists.win_percent = row['win_per']
                    exists.clean_sheets = row['clean_sheets']

                else:
                    team = OverallStanding(
                        team_id = row['team_id'],
                        league_id = row['league_id'],
                        league = row['league'],
                        season = row['season'],
                        rank = row['rank'],
                        team = row['teams'],
                        played = row['played'],
                        wins = row["wins"], 
                        draws = row["draws"], 
                        losses = row["losses"],
                        goals = row["goals"],
                        goals_conceded = row["goal con"],
                        goal_diff = row["goal diff"],
                        points = row["points"],
                        win_percent = row['win_per'],
                        clean_sheets = row['clean_sheets']
                    )

                    db.add(team)
            db.commit()
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    def home_table(self):
        try:
            db = session()
            for index,row in self.table.iterrows():
                exists = (db.query(HomeStanding)
                        .filter(HomeStanding.season==row['season'], 
                                    HomeStanding.team==row['teams'])
                        .first()
                )

                if exists:
                    exists.team_id = row['team_id']
                    exists.league_id = row['league_id']
                    exists.league = row['league']
                    exists.season = row['season']
                    exists.rank = row['rank']
                    exists.team = row['teams']
                    exists.played = row['played']
                    exists.wins = row["wins"]
                    exists.draws = row["draws"]
                    exists.losses = row["losses"]
                    exists.goals = row["goals"]
                    exists.goals_conceded = row["goal con"]
                    exists.goal_diff = row["goal diff"]
                    exists.points = row["points"]
                    exists.win_percent = row['win_per']
                    exists.clean_sheets = row['clean_sheets']

                else:
                    team = HomeStanding(
                        team_id = row['team_id'],
                        league_id = row['league_id'],
                        league = row['league'],
                        season = row['season'],
                        rank = row['rank'],
                        team = row['teams'],
                        played = row['played'],
                        wins = row["wins"], 
                        draws = row["draws"], 
                        losses = row["losses"],
                        goals = row["goals"],
                        goals_conceded = row["goal con"],
                        goal_diff = row["goal diff"],
                        points = row["points"],
                        win_percent = row['win_per'],
                        clean_sheets = row['clean_sheets']
                    )

                    db.add(team)
            db.commit()

        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    def away_table(self):
        try:
            db = session()
            for index,row in self.table.iterrows():
                exists = (db.query(AwayStanding)
                        .filter(AwayStanding.season==row['season'], 
                                AwayStanding.team==row['teams'])
                        .first()
                )

                if exists:
                    exists.team_id = row['team_id']
                    exists.league_id = row['league_id']
                    exists.league = row['league']
                    exists.season = row['season']
                    exists.rank = row['rank']
                    exists.team = row['teams']
                    exists.played = row['played']
                    exists.wins = row["wins"]
                    exists.draws = row["draws"]
                    exists.losses = row["losses"]
                    exists.goals = row["goals"]
                    exists.goals_conceded = row["goal con"]
                    exists.goal_diff = row["goal diff"]
                    exists.points = row["points"]
                    exists.win_percent = row['win_per']
                    exists.clean_sheets = row['clean_sheets']

                else:
                    team = AwayStanding(
                        team_id = row['team_id'],
                        league_id = row['league_id'],
                        league = row['league'],
                        season = row['season'],
                        rank = row['rank'],
                        team = row['teams'],
                        played = row['played'],
                        wins = row["wins"], 
                        draws = row["draws"], 
                        losses = row["losses"],
                        goals = row["goals"],
                        goals_conceded = row["goal con"],
                        goal_diff = row["goal diff"],
                        points = row["points"],
                        win_percent = row['win_per'],
                        clean_sheets = row['clean_sheets']
                    )

                    db.add(team)
            db.commit()

        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    def team_table(self):
        try:
            db = session()
            for index,row in self.table.iterrows():
                exists = (db.query(Teams)
                        .filter(Teams.season==row['season'], 
                                Teams.team_id==row['team_id'])
                        .first()
                )

                if exists:
                    exists.team_id = row["team_id"]
                    exists.team = row["teams"]
                    exists.code = row["code"]
                    exists.country = row["country"]
                    exists.founded = row["founded"]
                    exists.league_id = row["league_id"]
                    exists.logo = row["logo"]
                    exists.season = row["season"]
                    exists.venue_id = row["venue_id"]

                else:

                    team = Teams(
                    team_id = row["team_id"],
                    team = row["teams"],
                    code = row["code"],
                    country = row["country"],
                    founded = row["founded"],
                    league_id = row["league_id"],
                    logo = row["logo"],
                    season = row["season"],
                    venue_id = row["venue_id"]                   
                    )

                    db.add(team)
            db.commit()
        
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()




