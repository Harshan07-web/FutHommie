from etl.extract import Fetch
from etl.transform import Build
from etl.load import StoreData

for i in range(2022,2025):
    response = Fetch(39,i).fetch_fixtures()
    data = response.json()

    Build(data).points_table()
    Build(data).home_points_table()
    Build(data).away_points_table()

