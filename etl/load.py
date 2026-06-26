from database.database import session
from database.fixture_models import OverallStanding, HomeStanding,AwayStanding , Teams, Squad, League, Venues, PlayerInfo, Fixtures


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
                        .filter(Teams.league_id==row['league_id'])
                        .filter(Teams.season==row['season'])
                        .first()
                )

                if exists:
                    continue

                else:

                    team = Teams(
                    team_id = row["team_id"],
                    team = row["teams"],
                    code = row["code"],
                    country = row["country"],
                    founded = row["founded"],
                    league_id = row["league_id"],
                    logo = row["logo"],
                    season = row['season'],
                    venue_id = row["venue_id"]                   
                    )

                    db.add(team)
            db.commit()
        
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    def squad_table(self):
        try:
            import pandas as pd
            db = session()
            for index,row in self.table.iterrows():
                exists = (db.query(Squad)
                        .filter(Squad.player_id==row['player_id'])
                        .first()
                )

                if exists:
                    exists.player_id = row['player_id']
                    exists.name = row['name']
                    exists.age = row['age']
                    exists.team = row['team']
                    exists.team_id = row['team_id']
                    exists.number = row['number']
                    exists.position = row['position']
                    exists.photo = row['photo']

                else:

                    squads = Squad(
                        player_id = row['player_id'],
                        name = row['name'],
                        age = row['age'],
                        team = row['team'],
                        team_id = row['team_id'],
                        number = row['number'],
                        position = row['position'],
                        photo = row['photo']                
                    )

                    db.add(squads)
            db.commit()
        
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()
        
    def league_table(self):
        try:
            db = session()
            for index,row in self.table.iterrows():
                exists = (db.query(League)
                        .filter(League.league_id==row['league_id'])
                        .first()
                )

                if exists:
                    exists.league_name = row['league_name']
                    exists.league_type = row['league_type']
                    exists.country = row['country']
                    exists.logo = row['logo']

                else:

                    leagues = League(
                        league_id = row['league_id'],
                        league_name = row['league_name'],
                        league_type = row['league_type'],
                        country = row['country'],
                        logo = row['logo']                          
                    )

                    db.add(leagues)
            db.commit()
        
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    def venue_table(self):
        try:
            db = session()
            for index,row in self.table.iterrows():
                exists = (db.query(Venues)
                        .filter(Venues.venue_id==row['venue_id'])
                        .first()
                )

                if exists:
                    exists.name = row['name']
                    exists.address = row['address']
                    exists.city = row['city']
                    exists.country = row['country']
                    exists.capacity = row['capacity']
                    exists.surface = row['surface']
                    exists.image = row['image']

                else:

                    venue = Venues(
                        venue_id = row['venue_id'],
                        name = row['name'],
                        address = row['address'],
                        city = row['city'],
                        country = row['country'],
                        capacity = row['capacity'],
                        surface = row['surface'],
                        image = row['image']              
                    )

                    db.add(venue)
            db.commit()
        
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    def player_table(self):
        try:
            db = session()
            for index,row in self.table.iterrows():
                exists = db.query(PlayerInfo).filter(PlayerInfo.player_id==row['player_id']).first()

                if exists:
                    continue

                else:
                    player = PlayerInfo(
                        player_id = row['player_id'],
                        name = row['name'],
                        firstname = row['firstname'],
                        lastname = row['lastname'],
                        age = row['age'],
                        nationality = row['nationality'],
                        height = row['height'],
                        weight = row['weight'],
                        position = row['position'],
                        photo = row['photo']
                    )

                    db.add(player)
            db.commit()
        
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    def fixture_table(self):
        try:
            db = session()
            existing_ids = {
                    row[0]
                    for row in db.query(Fixtures.fixture_id).all()
                }
            for index,row in self.table.iterrows():
                if row['fixture_id'] in existing_ids:
                    continue

                fixture = Fixtures(
                    fixture_id = row['fixture_id'],
                    league_id = row['league_id'],
                    season = row['season'],
                    league_round = row['league_round'],
                    venue_id = row['venue_id'],
                    date = row['date'],
                    timezone = row['timezone'],
                    timestamp = row['timestamp'],
                    first_period = row['first_period'],
                    second_period = row['second_period'],
                    referee = row['referee'],
                    status = row['status'],
                    elapsed = row['elapsed'],
                    home_id = row['home_id'],
                    away_id = row['away_id'],
                    winner = row['winner'],
                    home_goals = row['home_goals'],
                    away_goals = row['away_goals'],
                    standings = row['standings'],
                    ht_home_goals = row['ht_home_goals'],
                    ht_away_goals = row['ht_away_goals'],
                    ft_home_goals = row['ft_home_goals'],
                    ft_away_goals = row['ft_away_goals'],
                    et_home_goals = row['et_home_goals'],
                    et_away_goals = row['et_away_goals'],
                    pen_home_goals = row['pen_home_goals'],
                    pen_away_goals = row['pen_away_goals'],
                )

                db.add(fixture)
            db.commit()

        except Exception as e:
            db.rollback()
            raise e
        
        finally:
            db.close()
                







