from etl.extract import Fetch
from etl.transform import Build
from etl.load import StoreData

response = Fetch(39,2024).fetch_fixtures()
data = response.json()

Build(data).points_table()
Build(data).home_points_table()
Build(data).away_points_table()

