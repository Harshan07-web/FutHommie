# Football ELT and ETL pipelines

## Overview

A data engineering project based on football data that is fetched from the an API(`API-FOOTBALL`). Main aim of the project is to fetch and store data from football api and use it for analytics.

## Initial Process
(Phase 1)
- The data is fetched from the API using requests
- The response is converted into JSON
- JSON data is used to transform the data and store in pandas DataFrame
- From the Pandas DataFrame data is stored to local DB
- Currently top 5 leagues from Europe from season 2022 - 2024 are stored
- 3 tables for phase 1 - which includes overall standing table, home table and away table
- simple FastAPI swagger UI to retrieve standings and team data

(phase 2) upcoming
- increase the table to contain fixtures that map to individual teams
- store team stats
- store individual player stats
- develop the frontend to display data in a better UI
