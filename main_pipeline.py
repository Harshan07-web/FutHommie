import json

from data.fetch_data import fetch
from data.convert_data import build

league_id = 39 #pl
season = 2024

response = fetch(league_id,season).fetch_fixtures()
json_data = response.json()

table = build(json_data).build_data()

print(table)

