import requests
import os
from dotenv import load_dotenv

load_dotenv()
#39	7293

API = os.getenv("FOOTBALL_API")
url = os.getenv("BASE_URL")

params={
    "league" : 39,
    "season" : 2024
}

headers = {
  'x-apisports-key': API,
}

response = requests.request("GET", url, headers=headers, params=params)

print(response.text)