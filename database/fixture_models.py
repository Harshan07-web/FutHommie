from sqlalchemy import Column,VARCHAR,Integer,Float, UniqueConstraint
from database.base import base

class OverallStanding(base):
    __tablename__ = "overall_standing"

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(Integer)
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
    team_id = Column(Integer)
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
    team_id = Column(Integer)
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


