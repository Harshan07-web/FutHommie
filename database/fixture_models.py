from sqlalchemy import Column,VARCHAR,Integer,Float, UniqueConstraint, ForeignKey
from database.base import base

class OverallStanding(base):
    __tablename__ = "overall_standing"

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(Integer,ForeignKey("team_info.team_id"))
    league_id = Column(Integer)
    league = Column(VARCHAR(255))
    season = Column(Integer)
    rank = Column(Integer)
    team = Column(VARCHAR(255))
    played = Column(Integer)
    wins = Column(Integer)
    draws = Column(Integer)
    losses = Column(Integer)
    goals = Column(Integer)
    goals_conceded = Column(Integer)
    goal_diff = Column(Integer)
    points =Column(Integer)
    win_percent = Column(Float)
    clean_sheets = Column(Integer)

    __table_args__ = (
        UniqueConstraint('season','team',name='unique_season_team'),
    )

class HomeStanding(base):
    __tablename__ = 'home_standing'

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(Integer,ForeignKey("team_info.team_id"))
    league_id = Column(Integer)
    league = Column(VARCHAR(255))
    season = Column(Integer)
    rank = Column(Integer)
    team = Column(VARCHAR(255))
    played = Column(Integer)
    wins = Column(Integer)
    draws = Column(Integer)
    losses = Column(Integer)
    goals = Column(Integer)
    goals_conceded = Column(Integer)
    goal_diff = Column(Integer)
    points =Column(Integer)
    win_percent = Column(Float)
    clean_sheets = Column(Integer)

    __table_args__ = (
        UniqueConstraint('season','team',name='unique_home_season_team'),
    )

class AwayStanding(base):
    __tablename__ = 'away_standing'

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(Integer,ForeignKey("team_info.team_id"))
    league_id = Column(Integer)
    league = Column(VARCHAR(255))
    season = Column(Integer)
    rank = Column(Integer)
    team = Column(VARCHAR(255))
    played = Column(Integer)
    wins = Column(Integer)
    draws = Column(Integer)
    losses = Column(Integer)
    goals = Column(Integer)
    goals_conceded = Column(Integer)
    goal_diff = Column(Integer)
    points =Column(Integer)
    win_percent = Column(Float)
    clean_sheets = Column(Integer)

    __table_args__ = (
        UniqueConstraint('season','team',name='unique_away_season_team'),
    )

class Teams(base):
    __tablename__ = 'team_info'

    id = Column(Integer,primary_key=True,autoincrement=True)
    team_id = Column(Integer,unique=True)
    team = Column(VARCHAR(255))
    code = Column(VARCHAR(255))
    country = Column(VARCHAR(255))
    founded = Column(VARCHAR(255))
    logo = Column(VARCHAR(255))
    venue_id = Column(Integer,unique=True)
    league_id = Column(Integer,ForeignKey('league_info.league_id'))
    season = Column(Integer)

    __table_args__ = (
        UniqueConstraint('season','team','league_id',name='unique_season_league_team'),
    )

class Venues(base):
    __tablename__ = 'team_venues'

    venue_id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(255))
    address = Column(VARCHAR(255))
    city = Column(VARCHAR(255))
    country = Column(VARCHAR(255))
    capacity = Column(Integer)
    surface = Column(VARCHAR(255))
    image = Column(VARCHAR(255))

class Squad(base):
    __tablename__ = 'squads_teams'

    player_id = Column(Integer,primary_key=True)
    name = Column(VARCHAR(255))
    age = Column(Integer)
    team = Column(VARCHAR(255))
    team_id = Column(Integer)
    number = Column(Integer)
    position = Column(VARCHAR(255))
    photo = Column(VARCHAR(255))

class League(base):
    __tablename__ = 'league_info'

    league_id = Column(Integer,primary_key=True)
    league_name = Column(VARCHAR(255))
    league_type = Column(VARCHAR(255))
    country = Column(VARCHAR(255))
    logo = Column(VARCHAR(255))

class PlayerInfo(base):
    __tablename__ = 'player_info'

    player_id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(255))
    firstname = Column(VARCHAR(255))
    lastname = Column(VARCHAR(255))
    age = Column(Integer)
    nationality = Column(VARCHAR(255))
    height = Column(VARCHAR(20))
    weight = Column(VARCHAR(20))
    position = Column(VARCHAR(255))
    photo = Column(VARCHAR(255))



    


