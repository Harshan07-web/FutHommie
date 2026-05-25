import json
import pandas as pd

#from etl.extract import fetch
from extract import fetch

class build:
    def __init__(self,json_data):
        self.json_data = json_data

    def build_data(self):
        with open("data/raw/raw_results.json","w") as f:
            json.dump(self.json_data,f,indent=5)


        tot_matches = self.json_data["results"]
        final_data = {}
        for i in range(tot_matches):
            home = self.json_data['response'][i]['teams']['home']['name']
            away = self.json_data['response'][i]['teams']['away']['name']
            home_goals = self.json_data['response'][i]['goals']['home']
            away_goals = self.json_data['response'][i]['goals']['away']
            if home not in final_data:
                final_data[home] = {
                                    "played" : 0,
                                    "wins" : 0, 
                                    "draws":0, 
                                    "losses":0,
                                    "goals":0,
                                    "goal con":0,
                                    "goal diff":0,
                                    "home_wins" :0, 
                                    "away_wins" :0 , 
                                    "points" : 0,
                                    "home_points" : 0,
                                    "away_points" : 0,
                                    'win_per' : 0,
                                    'clean_sheets' :0
                                    }
            if away not in final_data:
                final_data[away] = {
                                    "played" : 0,
                                    "wins" : 0, 
                                    "draws":0, 
                                    "losses":0,
                                    "goals":0,
                                    "goal con":0,
                                    "goal diff":0, 
                                    "home_wins":0, 
                                    "away_wins" : 0, 
                                    "points" : 0,
                                    "home_points" : 0,
                                    "away_points" : 0,
                                    'win_per' : 0,
                                    'clean_sheets' :0
                                    }

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
                final_data[home]["home_wins"] += 1
                final_data[away]["losses"] +=1
                final_data[home]['home_points']+=3
                if away_goals==0:
                    final_data[home]['clean_sheets']+=1
            else:
                final_data[away]["wins"] += 1
                final_data[away]["away_wins"] += 1
                final_data[home]["losses"] +=1
                final_data[away]['away_points']+=3
                if home_goals==0:
                    final_data[away]['clean_sheets']+=1

        for team in final_data:
            final_data[team]['points'] = final_data[team]['wins']*3 + final_data[team]['draws']*1
            final_data[team]['goal diff'] = final_data[team]['goals'] - final_data[team]['goal con']
            final_data[team]['win_per'] = round((final_data[team]['wins']/final_data[team]['played'])*100,2)
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={"index" : "teams"}, inplace=True)
        table.sort_values(["points", "goal diff", "goals"],ascending=False,inplace=True)
        table.insert(0, "rank", range(1, len(table) + 1))

        table.to_csv(r"data\processed\standings.csv",index=False)

        return table
    
