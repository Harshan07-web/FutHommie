from etl.extract import Fetch
from etl.transform import Build
from etl.load import StoreData
import time

leagues = [39,140,78,135,61]
# 39 - pl
# 140 - la liga
# 78 - bundesliga
# 135 - serie a
# 61 - league un

# for i in range(2022,2025):
#     for league in leagues:
#         if i!=2022:
#             time.sleep(62)
#         response = Fetch(league,i).fetch_fixtures()
#         print(response.status_code)
#         data = response.json()
        
#         Build(data).points_table()
#         Build(data).home_points_table()
#         Build(data).away_points_table()

response = Fetch(league_id=39,season=2024).fetch_teams()
data = response.json()
Build(data).team_table()


