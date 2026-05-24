import json
import pandas as pd

from data.fetch_data import fetch

class build:
    def __init__(self,json_data):
        self.json_data = json_data

    def build_data(self):
        with open("raw_data/raw_results.json","w") as f:
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
                                    "wins" : 0, 
                                    "draws":0, 
                                    "losses":0,
                                    "goals":0,
                                    "goal con":0,
                                    "goal diff":0,
                                    "home_wins" :0, 
                                    "away_wins" :0 , 
                                    "points" : 0
                                    }
            if away not in final_data:
                final_data[away] = {
                                    "wins" : 0, 
                                    "draws":0, 
                                    "losses":0,
                                    "goals":0,
                                    "goal con":0,
                                    "goal diff":0, 
                                    "home_wins":0, 
                                    "away_wins" : 0, 
                                    "points" : 0
                                    }

            final_data[home]['goals'] += home_goals
            final_data[away]['goals'] += away_goals
            final_data[home]["goal con"] += away_goals
            final_data[away]["goal con"] += home_goals

            home_win = self.json_data['response'][i]['teams']['home']['winner']
            away_win = self.json_data['response'][i]['teams']['away']['winner']

            if not home_win and not away_win:
                final_data[home]["draws"] += 1
                final_data[away]["draws"] +=1
            elif home_win:
                final_data[home]["wins"] += 1
                final_data[home]["home_wins"] += 1
                final_data[away]["losses"] +=1
            else:
                final_data[away]["wins"] += 1
                final_data[away]["away_wins"] += 1
                final_data[home]["losses"] +=1

        for team in final_data:
            final_data[team]['points'] = final_data[team]['wins']*3 + final_data[team]['draws']*1
            final_data[team]['goal diff'] = final_data[team]['goals'] - final_data[team]['goal con']
        table = pd.DataFrame.from_dict(final_data,orient='index')
        table.reset_index(inplace=True)
        table.rename(columns={"index" : "teams"}, inplace=True)
        table.sort_values("points",ascending=False,inplace=True)

        return table