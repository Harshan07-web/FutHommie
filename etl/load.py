from database.database import session
from database.fixture_models import OverallStanding, HomeStanding,AwayStanding , Teams, Squad, League, Venues, PlayerInfo, PlayerStats


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

    def squad_table(self):
        try:
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

    def player_details_table(Self):
        try:
            db = session()
            for index,row in Self.table.iterrows():
                pass
        except:
            pass




