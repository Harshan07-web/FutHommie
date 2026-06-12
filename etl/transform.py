import json
import pandas as pd
from etl.extract import Fetch
from etl.load import StoreData
# from load import StoreData

class Build:
    def __init__(self,json_data):
        self.json_data = json_data

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
                                    "home_points" : 0,
                                    "away_points" : 0,
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
                                    "home_points" : 0,
                                    "away_points" : 0,
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
                final_data[home]['home_points']+=1
                final_data[away]['away_points']+=1
                if home_goals==0 and away_goals==0:
                    final_data[home]['clean_sheets']+=1
                    final_data[away]['clean_sheets']+=1
            elif home_win:
                final_data[home]["wins"] += 1
                final_data[away]["losses"] +=1
                final_data[home]['home_points']+=3
                if away_goals==0:
                    final_data[home]['clean_sheets']+=1
            else:
                final_data[away]["wins"] += 1
                final_data[home]["losses"] +=1
                final_data[away]['away_points']+=3
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
                                "league_id" : self.json_data['parameters']['league'],
                                "season" : self.json_data['parameters']['season']
                                }

        table = self.build_team_table(final_data=final_data)
        table.to_csv(r"data\processed\teams.csv",index=False)
        StoreData(table).team_table()

    def squad_table(self):
        final_data = {}
        team = self.json_data['response']['team']['name']
        team_id = self.json_data['response']['team']['name']
        players = self.json_data['response']['players']
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

    def player_stats_table(self):
        final_data = {}
        pass

    def league_table(self):
        final_data = {}
        league = self.json_data['response']['league']
        league_id = league['id']
        final_data[league_id] = {
            'league_name' : league['name'],
            'league_type' : league['type'],
            'country' : self.json_data['response']['country']['name'],
            'logo' : league['logo']
        }

        table = self.build_league_table(final_data)
        StoreData(table).league_table()



    def calculate_addition_data(self,final_data:dict):
        for team in final_data:
            final_data[team]['points'] = final_data[team]['wins']*3 + final_data[team]['draws']*1
            final_data[team]['goal diff'] = final_data[team]['goals'] - final_data[team]['goal con']
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

        return table

    def build_team_table(self,final_data:dict):
        if not final_data:
            raise ValueError("No match data to build table from. check that the API response contains results.")
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index':'teams'},inplace=True)
        table.reset_index(inplace=True,drop=True)

        return table
    
    def build_squad_table(self,final_data:dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index':'player_id'},inplace=True)

        return table
    
    def build_league_table(self,final_data:dict):
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={'index':'league_id'},inplace=True)

        return table
