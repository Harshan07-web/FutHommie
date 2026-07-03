from sqlalchemy import Column,VARCHAR,Integer,Float, UniqueConstraint, ForeignKey, DateTime, Boolean
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

class Teams(base):
    __tablename__ = 'team_info'

    id = Column(Integer,primary_key=True,autoincrement=True)
    team_id = Column(Integer)
    team = Column(VARCHAR(255))
    code = Column(VARCHAR(255))
    country = Column(VARCHAR(255))
    founded = Column(VARCHAR(255))
    logo = Column(VARCHAR(255))
    venue_id = Column(Integer)
    season = Column(Integer)
    league_id = Column(Integer,ForeignKey('league_info.league_id'))

__table_args__ = (
    UniqueConstraint(
        'team_id','league_id','season', name='unique_season_league_team'
    ),
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

    id = Column(Integer,primary_key=True,autoincrement=True)
    player_id = Column(Integer)
    name = Column(VARCHAR(255))
    firstname = Column(VARCHAR(255))
    lastname = Column(VARCHAR(255))
    age = Column(Integer)
    nationality = Column(VARCHAR(255))
    height = Column(VARCHAR(20))
    weight = Column(VARCHAR(20))
    position = Column(VARCHAR(255))
    photo = Column(VARCHAR(255))

class Fixtures(base):
    __tablename__ = 'fixture_table'

    fixture_id = Column(Integer,primary_key=True)
    league_id = Column(Integer)
    season = Column(Integer)
    league_round = Column(VARCHAR(255))
    venue_id = Column(Integer)

    date = Column(DateTime)
    timezone = Column(VARCHAR(20))
    timestamp = Column(Integer)
    first_period = Column(Integer)
    second_period = Column(Integer)

    referee = Column(VARCHAR(255))
    status = Column(VARCHAR(225))
    elapsed = Column(Integer)

    home_id = Column(Integer)
    away_id = Column(Integer)
    winner = Column(Integer) #has to store winning team id
    home_goals = Column(Integer)
    away_goals = Column(Integer)
    standings = Column(Boolean)

    ht_home_goals = Column(Integer)
    ht_away_goals = Column(Integer)
    ft_home_goals = Column(Integer)
    ft_away_goals = Column(Integer)
    et_home_goals = Column(Integer)
    et_away_goals = Column(Integer)
    pen_home_goals = Column(Integer)
    pen_away_goals = Column(Integer)

class PlayerLeaderBoard(base):
    __tablename__ = 'player_leaderboard'

    id = Column(Integer,primary_key=True,autoincrement=True)
    league_id = Column(Integer)
    season = Column(Integer)
    player_id = Column(Integer)
    team_id = Column(Integer)
    goals_tot = Column(Integer)
    assists_tot = Column(Integer)
    conceded = Column(Integer)
    saves = Column(Integer)
    yellow_tot = Column(Integer)
    yellowred_tot = Column(Integer)
    red_tot = Column(Integer)
    position = Column(VARCHAR(100))
    rating = Column(Float)
    appearances = Column(Integer)
    leaderboard_type = Column(VARCHAR(20))
    
class DataORGMatch(base):
    __tablename__ = "fd_matches"

    fixture_id = Column(Integer, primary_key=True)
    season = Column(Integer)
    competition_id = Column(Integer)
    competition_name = Column(VARCHAR(100))
    competition_code = Column(VARCHAR(20))
    competition_logo = Column(VARCHAR(255))

    current_matchday = Column(Integer)
    matchday = Column(Integer)

    referee_id = Column(Integer)
    referee = Column(VARCHAR(255))
    referee_nationality = Column(VARCHAR(100))

    date = Column(DateTime)
    last_updated = Column(DateTime)

    status = Column(VARCHAR(50))
    stage = Column(VARCHAR(50))
    group = Column(VARCHAR(50))
    duration = Column(VARCHAR(50))
    winner = Column(VARCHAR(20))

    home_id = Column(Integer)
    away_id = Column(Integer)

    ht_home_goals = Column(Integer)
    ht_away_goals = Column(Integer)
    ft_home_goals = Column(Integer)
    ft_away_goals = Column(Integer)
    rt_home_goals = Column(Integer)
    rt_away_goals = Column(Integer)
    et_home_goals = Column(Integer)
    et_away_goals = Column(Integer)
    pen_home_goals = Column(Integer)
    pen_away_goals = Column(Integer)


class DataORGTeams(base):
    __tablename__ = 'DO_Teams'

    id = Column(Integer,primary_key=True,autoincrement=True)
    team_id = Column(Integer)
    name = Column(VARCHAR(255))
    tla = Column(VARCHAR(10))
    logo = Column(VARCHAR(255))

class DataORGComp(base):
    __tablename__ = 'DO_comps'

    id = Column(Integer,primary_key=True,autoincrement=True)
    league_id = Column(Integer)
    name = Column(VARCHAR(50))
    logo = Column(VARCHAR(225))

class DataORGPlayers(base):
    __tablename__ = 'DO_Players'

    id = Column(Integer,primary_key=True,autoincrement=True)
    player_id = Column(Integer)
    name = Column(VARCHAR(225))
    position = Column(VARCHAR(100))
    national_team_id = Column(Integer)
    dob = Column(VARCHAR(50))
    team_id = Column(Integer)

class DataORGScorers(base):
    __tablename__ = "DO_Scorers"

    id = Column(Integer, primary_key=True, autoincrement=True)

    competition_id = Column(Integer)
    season = Column(Integer)

    player_id = Column(Integer)
    player_name = Column(VARCHAR(255))
    firstname = Column(VARCHAR(255))
    lastname = Column(VARCHAR(255))
    dob = Column(VARCHAR(225))
    nationality = Column(VARCHAR(100))
    section = Column(VARCHAR(100))
    position = Column(VARCHAR(100))
    shirt_number = Column(Integer)

    team_id = Column(Integer)
    team_name = Column(VARCHAR(255))

    played_matches = Column(Integer)
    goals = Column(Integer)
    assists = Column(Integer)
    penalties = Column(Integer)


    


