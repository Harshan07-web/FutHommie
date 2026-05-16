import requests

#39	7293
#

url = "https://v3.football.api-sports.io/fixtures"

params={
    "league" : 39,
    "season" : 2024
}
headers = {
  'x-apisports-key': '7487df84048b717a30555981eb06ae81',
}

response = requests.request("GET", url, headers=headers, params=params)

print(response.text)