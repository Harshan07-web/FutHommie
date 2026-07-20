import json
import pandas as pd
from etl.extract import Fetch
from etl.load import StoreData
from datetime import datetime
# from load import StoreData

class Build:
    def __init__(self,json_data):
        self.json_data = json_data

    def fixtures_table(self):
        final_data = {}
        res = self.json_data['response']
        tot_matches = self.json_data['results']
        for i in range (tot_matches):
            fixture = res[i]['fixture']
            league = res[i]['league']
            teams = res[i]['teams']
            goals = res[i]['goals']
            score = res[i]['score']
            date = datetime.fromisoformat(fixture["date"])

            if teams['home']['winner']:
                winner = teams['home']['id']
            elif teams['away']['winner']:
                winner = teams['away']['id']
            else:
                winner = None

            final_data[fixture['id']] = {
                 "league_id" : league['id'],
                 "season" : league['season'],
                 "league_round" : league['round'],
                 "venue_id" : fixture['venue']['id'],
                 "date" : date,
                 "timezone" : fixture['timezone'],
                 "timestamp" : fixture['timestamp'],
                 "first_period" : fixture['periods']['first'],
                 "second_period" : fixture['periods']['second'],
                 "referee" : fixture['referee'],
                 "status" : fixture['status']['long'],
                 "elapsed" : fixture['status']['elapsed'],
                 "home_id" : teams['home']['id'],
                 "away_id" : teams['away']['id'],
                 "winner" : winner,
                 "home_goals" : goals['home'],
                 "away_goals" : goals['away'],
                 "standings" : league['standings'],
                 "ht_home_goals" : score['halftime']['home'],
                 "ht_away_goals" : score['halftime']['away'],
                 "ft_home_goals" : score['fulltime']['home'],
                 "ft_away_goals" : score['fulltime']['away'],
                 "et_home_goals" : score['extratime']['home'],
                 "et_away_goals" : score['extratime']['away'],
                 "pen_home_goals" : score['penalty']['home'],
                 "pen_away_goals" : score['penalty']['away'],
            }

        table = self.build_fixtures_table(final_data=final_data)
        table.to_csv(rf"data\processed\fixtures_{league['id']}_{league['season']}.csv",index=False)
        StoreData(table).fixture_table()

    def points_table(self):
        tot_matches = self.json_data["results"]
        final_data = {}
        for i in range(tot_matches):
            round_name = self.json_data['response'][i]['league']['round']
            if "Regular Season" not in round_name:
                continue
            home = self.json_data['response'][i]['teams']['home']['name']
            away = self.json_data['response'][i]['teams']['away']['name']

            home_goals = self.json_data['response'][i]['goals']['home']
            away_goals = self.json_data['response'][i]['goals']['away']

            if home_goals is None or away_goals is None:
                continue

            if home not in final_data:
                final_data[home] = {
                                    "team_id" : 0,
                                    "league_id" : 0,
                                    "league" : "",
                                    "season" : 0,
                                    "played" : 0,
                                    "wins" : 0, 
                                    "draws":0, 
                                    "losses":0,
                                    "goals":0,
                                    "goal con":0,
                                    "goal diff":0,
                                    "points" : 0,
                                    'win_per' : 0,
                                    'clean_sheets' :0
                                    }
            if away not in final_data:
                final_data[away] = {
                                    "team_id" : 0,
                                    "league_id" : 0,
                                    "league" : "",
                                    "season" : 0,
                                    "played" : 0,
                                    "wins" : 0, 
                                    "draws":0, 
                                    "losses":0,
                                    "goals":0,
                                    "goal con":0,
                                    "goal diff":0, 
                                    "points" : 0,
                                    'win_per' : 0,
                                    'clean_sheets' :0
                                    }
            final_data[home]['season'] = self.json_data['response'][i]['league']['season']
            final_data[away]['season'] = self.json_data['response'][i]['league']['season']
            final_data[home]['league_id'] = self.json_data['response'][i]['league']['id']
            final_data[away]['league_id'] = self.json_data['response'][i]['league']['id']
            final_data[home]['league'] = self.json_data['response'][i]['league']['name']
            final_data[away]['league'] = self.json_data['response'][i]['league']['name']
            final_data[home]['team_id'] = self.json_data['response'][i]['teams']['home']['id']
            final_data[away]['team_id'] = self.json_data['response'][i]['teams']['away']['id']

            final_data[home]['goals'] += home_goals
            final_data[away]['goals'] += away_goals
            final_data[home]["goal con"] += away_goals
            final_data[away]["goal con"] += home_goals
            final_data[home]['played']+=1
            final_data[away]['played'] +=1

            home_win = self.json_data['response'][i]['teams']['home']['winner']
            away_win = self.json_data['response'][i]['teams']['away']['winner']

            if not home_win and not away_win:
                final_data[home]["draws"] += 1
                final_data[away]["draws"] +=1
                if home_goals==0 and away_goals==0:
                    final_data[home]['clean_sheets']+=1
                    final_data[away]['clean_sheets']+=1
            elif home_win:
                final_data[home]["wins"] += 1
                final_data[away]["losses"] +=1
                if away_goals==0:
                    final_data[home]['clean_sheets']+=1
            else:
                final_data[away]["wins"] += 1
                final_data[home]["losses"] +=1
                if home_goals==0:
                    final_data[away]['clean_sheets']+=1

        final_data = self.calculate_addition_data(final_data)

        table = self.build_table(final_data)
        table.to_csv(r"data\processed\standings.csv",index=False)

        StoreData(table).overall_table()
    
    def home_points_table(self):
        tot_matches = self.json_data['results']
        final_data = {}
        for i in range(tot_matches):
            round_name = self.json_data['response'][i]['league']['round']
            if "Regular Season" not in round_name:
                continue
            
            info = self.json_data['response'][i]
            home_team = info['teams']['home']['name']

            home_goals = info['goals']['home']
            away_goals = info['goals']['away']

            if home_team not in final_data:
                final_data[home_team] = {
                                    "team_id" : 0,
                                    "league_id" : 0,
                                    "league" : "",
                                    "season" : 0,
                                    "played" : 0,
                                    "wins" : 0, 
                                    "draws":0, 
                                    "losses":0,
                                    "goals":0,
                                    "goal con":0,
                                    "goal diff":0,
                                    "points" : 0,
                                    'win_per' : 0,
                                    'clean_sheets' :0
                                    }
            final_data[home_team]['team_id'] = info['teams']['home']['id']
            final_data[home_team]['league_id'] = info['league']['id']
            final_data[home_team]['league'] = info['league']['name']
            final_data[home_team]['season'] = info['league']['season']
            final_data[home_team]['goals'] += home_goals
            final_data[home_team]['goal con'] += away_goals
            final_data[home_team]['played']+=1
            if away_goals==0:
                final_data[home_team]['clean_sheets'] +=1

            if info['teams']['home']['winner']:
                final_data[home_team]['wins'] += 1
            elif info['teams']['home']['winner'] is None and info['teams']['away']['winner'] is None:
                final_data[home_team]['draws'] +=1
            else:
                final_data[home_team]['losses'] += 1

        final_data = self.calculate_addition_data(final_data)

        table = self.build_table(final_data)
        table.to_csv(r"data\processed\hstandings.csv",index=False)
        StoreData(table).home_table()

    def away_points_table(self):
        tot_matches = self.json_data['results']
        final_data = {}
        for i in range(tot_matches):
            round_name = self.json_data['response'][i]['league']['round']
            if "Regular Season" not in round_name:
                continue
            info = self.json_data['response'][i]
            away_team = info['teams']['away']['name']

            home_goals = info['goals']['home']
            away_goals = info['goals']['away']

            if away_team not in final_data:
                final_data[away_team] = {
                                    "team_id" : 0,
                                    "league_id" : 0,
                                    "league" : "",
                                    "season" : 0,
                                    "played" : 0,
                                    "wins" : 0, 
                                    "draws":0, 
                                    "losses":0,
                                    "goals":0,
                                    "goal con":0,
                                    "goal diff":0,
                                    "points" : 0,
                                    'win_per' : 0,
                                    'clean_sheets' :0
                                    }
                
            final_data[away_team]['team_id'] = info['teams']['away']['id']
            final_data[away_team]['league_id'] = info['league']['id']
            final_data[away_team]['league'] = info['league']['name']
            final_data[away_team]['season'] = info['league']['season']
            final_data[away_team]['goals'] += away_goals
            final_data[away_team]['goal con'] += home_goals
            final_data[away_team]['played']+=1
            if home_goals==0:
                final_data[away_team]['clean_sheets'] +=1

            if info['teams']['home']['winner']:
                final_data[away_team]['losses'] += 1
            elif info['teams']['away']['winner'] is None and info['teams']['home']['winner'] is None:
                final_data[away_team]['draws'] +=1
            else:
                final_data[away_team]['wins'] += 1

        final_data = self.calculate_addition_data(final_data)

        table = self.build_table(final_data)
        table.to_csv(r"data\processed\astandings.csv",index=False)
        StoreData(table).away_table()

    def team_table(self):
        final_data = {}
        tot_teams = self.json_data['results']
        league_id = self.json_data['parameters']['league']
        season = self.json_data['parameters']['season']
        for i in range(tot_teams):
            response = self.json_data['response']
            team = response[i]['team']['name']
            
            final_data[team] = {
                                'team_id' : response[i]['team']['id'],
                                'code' : response[i]['team']['code'],
                                'country' : response[i]['team']['country'],
                                'founded' : response[i]['team']['founded'],
                                "logo" : response[i]['team']['logo'],
                                "venue_id" : response[i]['venue']['id'],
                                "season" : season,
                                "league_id" : league_id,
                                }

        table = self.build_team_table(final_data=final_data)
        table.to_csv(rf"data\processed\teams_{league_id}.csv",index=False)
        StoreData(table).team_table()

    def venue_table(self):
        final_data = {}
        res = self.json_data['response'][0]
        final_data[res['id']] = {
            'name' : res['name'],
            'address' : res['address'],
            'city' : res['city'],
            'country' : res['country'],
            'capacity' : res['capacity'],
            'surface' : res['surface'],
            'image' : res['image']
        }

        table = self.build_venue_table(final_data)
        StoreData(table).venue_table()


    def squad_table(self):
        final_data = {}
        team = self.json_data['response'][0]['team']['name']
        team_id = self.json_data['response'][0]['team']['id']
        players = self.json_data['response'][0]['players']
        for player in players:
            final_data[player['id']] = {
                'name' : player['name'],
                'age' : player['age'],
                'team' : team,
                'team_id' : team_id,
                'number' : player['number'],
                'position' : player['position'],
                'photo' : player['photo']
            }

        table = self.build_squad_table(final_data=final_data)
        table.to_csv(rf"data\processed\squads_{team_id}.csv",index=False)
        StoreData(table).squad_table()

    def player_details_table(self):
        final_data = {}
        player = self.json_data['response'][0]['player']
        final_data[player['id']] = {
            'name' : player['name'],
            'firstname' : player['firstname'],
            'lastname' : player['lastname'],
            'age' : player['age'],
            'nationality' : player['nationality'],
            'height' : player['height'],
            'weight' : player['weight'],
            'position' : player['position'],
            'photo' :player['photo']
        }

        table = self.build_player_details_table(final_data=final_data)
        table.to_csv(rf"data\processed\player_{player['id']}.csv",index=False)
        StoreData(table).player_table()

    def player_leaderboard(self, table_name):
        final_data = {}
        res = self.json_data["response"]

        for entry in res:
            player = entry["player"]

            for stats in entry["statistics"]:
                team = stats["team"]
                league = stats["league"]
                game = stats["games"]
                goals = stats["goals"]
                cards = stats["cards"]

                key = (
                    player["id"],
                    league["id"],
                    league["season"],
                    team["id"],
                    table_name,
                )

                final_data[key] = {
                    "player_id": player["id"],
                    "league_id": league["id"],
                    "season": league["season"],
                    "team_id": team["id"],
                    "goals_tot": goals["total"],
                    "assists_tot": goals["assists"],
                    "conceded": goals["conceded"],
                    "saves": goals["saves"],
                    "yellow_tot": cards["yellow"],
                    "yellowred_tot": cards["yellowred"],
                    "red_tot": cards["red"],
                    "position": game["position"],
                    "rating": float(game["rating"]) if game["rating"] else None,
                    "appearances": game["appearences"],
                    "leaderboard_type": table_name,
                }

        print(f"Collected {len(final_data)} rows")

        table = self.build_leaderboard_table(final_data)

        print(table.head())
        print(table.shape)

        table.to_csv(rf"data\processed\leaderboard_{table_name}_{league['season']}_{league['id']}.csv",index=False,)

        StoreData(table).leaderboard_table()

    def league_table(self):
        final_data = {}
        league = self.json_data['response'][0]['league']
        league_id = league['id']
        final_data[league_id] = {
            'league_name' : league['name'],
            'league_type' : league['type'],
            'country' : self.json_data['response'][0]['country']['name'],
            'logo' : league['logo']
        }

        table = self.build_league_table(final_data)
        StoreData(table).league_table()

#=============================================vibe coded starts

    def dataorg_matches(self):
        final_data = {}
        season = self.json_data['filters']['season']
        for match in self.json_data["matches"]:

            referee = match["referees"][0] if match["referees"] else {}

            score = match.get("score", {})
            ht = score.get("halfTime", {})
            rt = score.get("regularTime",{})
            ft = score.get("fullTime", {})
            et = score.get("extraTime", {})
            pen = score.get("penalties", {})

            if score.get("duration")=='REGULAR':
                et_home_goals = None
                et_away_goals = None
                pen_home_goals = None
                pen_away_goals = None
                rt_home_goals = None
                rt_away_goals = None
            else:
                et_home_goals  = et.get("home")
                et_away_goals  = et.get("away")
                pen_home_goals = pen.get("home")
                pen_away_goals = pen.get("away")
                rt_home_goals = rt.get("home")
                rt_away_goals = rt.get("away")

            final_data[match["id"]] = {
                
                "season" : season,
                "competition_id": match["competition"]["id"],
                "competition_name": match["competition"]["name"],
                "competition_code": match["competition"]["code"],
                "competition_logo": match["competition"]["emblem"],

                "current_matchday": match["season"]["currentMatchday"],
                "matchday": match["matchday"],

                "referee_id": referee.get("id"),
                "referee": referee.get("name"),
                "referee_nationality": referee.get("nationality"),

                "date": datetime.fromisoformat(
                    match["utcDate"].replace("Z", "+00:00")
                ),

                "last_updated": datetime.fromisoformat(
                    match["lastUpdated"].replace("Z", "+00:00")
                ),

                "status": match["status"],
                "stage": match["stage"],
                "group": match.get("group"),

                "duration": score.get("duration"),
                "winner": score.get("winner"),

                "home_id": match["homeTeam"]["id"],
                "away_id": match["awayTeam"]["id"],

                "ht_home_goals": ht.get("home"),
                "ht_away_goals": ht.get("away"),

                "rt_home_goals": rt_home_goals,
                "rt_away_goals": rt_away_goals,

                "ft_home_goals": ft.get("home"),
                "ft_away_goals": ft.get("away"),

                "et_home_goals": et_home_goals,
                "et_away_goals": et_away_goals,

                "pen_home_goals": pen_home_goals,
                "pen_away_goals": pen_away_goals,
            }

        table = self.build_dataorg_matches(final_data)
        StoreData(table).dataorg_matches()

    def dataorg_teams(self):
        final_data = {}

        for team in self.json_data["teams"]:

            final_data[team["id"]] = {
                "name": team["name"],
                "tla": team["tla"],
                "logo": team["crest"]
            }

        table = self.build_dataorg_teams(final_data)
        StoreData(table).dataorg_teams()

    def dataorg_competition(self):

        comp = self.json_data["competition"]

        final_data = {
            comp["id"]: {
                "name": comp["name"],
                "logo": comp["emblem"]
            }
        }

        table = self.build_dataorg_competitions(final_data)
        StoreData(table).dataorg_comp()

    def dataorg_players(self):
        final_data = {}

        for team in self.json_data["teams"]:

            for player in team["squad"]:

                final_data[player["id"]] = {
                    "name": player["name"],
                    "position": player["position"],
                    "national_team_id": team["id"],
                    "dob": player["dateOfBirth"],
                    "team_id": team["id"]
                }

        table = self.build_dataorg_players(final_data)
        StoreData(table).dataorg_players()

    from datetime import datetime

    def dataorg_scorers(self):

        final_data = {}

        competition = self.json_data["competition"]
        season = self.json_data['filters']['season']

        for scorer in self.json_data["scorers"]:

            player = scorer["player"]
            team = scorer["team"]

            final_data[player["id"]] = {

                "competition_id": competition["id"],
                "season": season,

                "player_name": player["name"],
                "firstname": player["firstName"],
                "lastname": player["lastName"],
                "dob": datetime.strptime(
                    player["dateOfBirth"],
                    "%Y-%m-%d"
                ).date(),
                "nationality": player["nationality"],
                "section": player["section"],
                "position": player["position"],
                "shirt_number": player["shirtNumber"],

                "team_id": team["id"],
                "team_name": team["name"],

                "played_matches": scorer["playedMatches"],
                "goals": scorer["goals"],
                "assists": scorer["assists"],
                "penalties": scorer["penalties"],
            }

        table = self.build_dataorg_top_scorers(final_data)
        StoreData(table).dataorg_scorers()


#=================================================vibe code ends

    def dataorg_standings(self):
        season = self.json_data['filters']['season']
        league_id = self.json_data['competition']['id']
        league = self.json_data['competition']['name']
        for standing in self.json_data['standings']:
            final_data = {}
            l_type = standing['type']

            for team in standing['table']:
                team_id = team['team']['id']

                final_data[team_id] = {
                'team' : team['team']['name'],
                'season': season,
                'league_id': league_id,
                'league': league,
                'rank' : team['position'],
                'played' : team['playedGames'],
                'wins' : team['won'],
                'draws' : team['draw'],
                'losses' : team['lost'],
                'goals' : team['goalsFor'],
                'goals_conceded' : team['goalsAgainst'],
                'goal_diff': team['goalDifference'],
                'points' : team['points'],
                'comp_round' : l_type
    }

            final_data = self.calculate_dataorg_addition_data(final_data=final_data)
            table = self.build_dataorg_standings(final_data)

            if l_type == "TOTAL":
                StoreData(table).dataorg_standings()
            elif l_type == "HOME":
                StoreData(table).dataorg_standings_home()
            elif l_type == "AWAY":
                StoreData(table).dataorg_standings_away()


    def calculate_addition_data(self,final_data:dict):
        for team in final_data:
            final_data[team]['points'] = final_data[team]['wins']*3 + final_data[team]['draws']*1
            final_data[team]['goal diff'] = final_data[team]['goals'] - final_data[team]['goal con']
            final_data[team]['win_per'] = round((final_data[team]['wins']/final_data[team]['played'])*100,2)

        return final_data
    
    def calculate_dataorg_addition_data(self,final_data:dict):
        for team in final_data:
            if final_data[team]['played']==0:
                final_data[team]['win_per'] = 0
            else:
                final_data[team]['win_per'] = round((final_data[team]['wins']/final_data[team]['played'])*100,2)

        return final_data
    
    def build_table(self,final_data:dict):
        if not final_data:
            raise ValueError("No match data to build a table from. Check that the API response contains results.")
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={"index" : "teams"}, inplace=True)
        table.sort_values(["points", "goal diff", "goals"],ascending=False,inplace=True)
        table.reset_index(inplace=True,drop=True)
        table.insert(0, "rank", range(1, len(table) + 1))
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table

    def build_team_table(self,final_data:dict):
        if not final_data:
            raise ValueError("No match data to build table from. check that the API response contains results.")
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index':'teams'},inplace=True)
        table.reset_index(inplace=True,drop=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_squad_table(self,final_data:dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index':'player_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_league_table(self,final_data:dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index':'league_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_player_details_table(self,final_data:dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index':'player_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_venue_table(self,final_data:dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index':'venue_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_fixtures_table(self,final_data : dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index' : 'fixture_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table

    def build_leaderboard_table(self,final_data : dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index' : 'player_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_dataorg_matches(self,final_data : dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index' : 'fixture_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_dataorg_teams(self,final_data : dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index' : 'team_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_dataorg_competitions(self,final_data : dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index' : 'league_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_dataorg_players(self,final_data : dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index' : 'player_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_dataorg_top_scorers(self,final_data : dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index' : 'player_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table
    
    def build_dataorg_standings(self,final_data : dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index' : 'team_id'},inplace=True)
        table = table.astype(object)
        table = table.where(pd.notnull(table), None)

        return table