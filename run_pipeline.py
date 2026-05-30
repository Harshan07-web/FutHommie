from etl.extract import Fetch
from etl.transform import Build
from etl.load import StoreData

leagues = [39,140,78,135,61]
# 39 - pl
# 140 - la liga
# 78 - bundesliga
# 135 - serie a
# 61 - league un

for i in range(2022,2025):
    response = Fetch(39,i).fetch_fixtures()
    data = response.json()

    Build(data).points_table()
    Build(data).home_points_table()
    Build(data).away_points_table()

