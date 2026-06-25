# Football Data Hub 

A full-stack football analytics platform that collects, transforms, stores, and visualizes football data from Europe's Top 5 leagues.

## Live Demo

Frontend: [https://football-data-hub.vercel.app/](https://football-data-hub.vercel.app/)

## Features

* League Standings

  * Overall Standings
  * Home Standings
  * Away Standings

* Teams

  * Browse all teams
  * View team details
  * Stadium information

* Players

  * Browse players
  * View player profiles
  * Player nationality, age, height, weight, and position

* Venues

  * Browse stadiums
  * Team logo integration
  * Stadium information pages

* Multi-season Support

  * 2022
  * 2023
  * 2024

* Top 5 European Leagues

  * Premier League
  * La Liga
  * Bundesliga
  * Serie A
  * Ligue 1

---

## Architecture

```text
                   API-Football
                        │
                        ▼
                Python ETL Pipeline
                        │
                        ▼
                 Railway MySQL
                        │
                        ▼
                  FastAPI Backend
                        │
                        ▼
                  React Frontend
                        │
                        ▼
                     Vercel
```

---

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Vite

### Backend

* FastAPI
* SQLAlchemy
* Pydantic

### Database

* MySQL
* Railway

### Data Engineering

* Python
* Pandas
* ETL Pipeline

### Deployment

* Vercel
* Railway

---

## Database Schema

### League Information

```text
league_info
```

Stores:

* League ID
* League Name
* Country
* Logo

---

### Team Information

```text
team_info
```

Stores:

* Team ID
* Team Name
* Team Logo
* Venue ID
* Country
* Founded Year
* League ID
* Season

---

### Venue Information

```text
venue_info
```

Stores:

* Venue ID
* Stadium Name
* City
* Capacity
* Surface

---

### Player Information

```text
player_info
```

Stores:

* Player ID
* Name
* First Name
* Last Name
* Age
* Nationality
* Height
* Weight
* Position
* Photo

---

### Standings

```text
overall_standing
home_standing
away_standing
```

Stores:

* Rank
* Team
* Matches Played
* Wins
* Draws
* Losses
* Goal Difference
* Points
* Season
* League

---

## ETL Pipeline

### Extract

Data is collected using the API-Football API.

Examples:

```text
Leagues
Teams
Players
Squads
Venues
Standings
```

---

### Transform

Data is cleaned and transformed using Pandas.

Examples:

* Build overall standings
* Build home standings
* Build away standings
* Normalize player information
* Generate structured datasets

---

### Load

Transformed data is loaded into MySQL using SQLAlchemy.

---

## API Endpoints

### Standings

```http
GET /standings/{season}/{league_id}
GET /fetch_home_table/{season}/{league_id}
GET /fetch_away_table/{season}/{league_id}
```

---

### Teams

```http
GET /fetch_teams
GET /fetch_team/{team_id}
```

---

### Players

```http
GET /fetch_players
GET /fetch_player/{player_id}
```

---

### Venues

```http
GET /fetch_all_venues
GET /fetch_venue/{venue_id}
```

---

### Leagues

```http
GET /fetch_leagues
GET /fetch_league/{league_id}
```

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/Harshan07-web/premier_league_elt.git

cd premier_league_elt
```

---

### Backend Setup

Create virtual environment:

```bash
conda create -n footballelt python=3.12

conda activate footballelt
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env`

```env
DATABASE_URL=your_database_url
API_KEY=your_api_key
```

Run FastAPI:

```bash
uvicorn api.main:app --reload
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Deployment

### Backend

Hosted on Railway.

Features:

* Automatic deployment from GitHub
* Managed MySQL database
* Environment variable support

### Frontend

Hosted on Vercel.

Features:

* Automatic deployment from GitHub
* Continuous deployment
* Global CDN

---

## Project Structure

```text
Football/
│
├── api/
│   ├── main.py
│   └── routes/
│
├── database/
│   ├── database.py
│   ├── base.py
│   └── models/
│
├── etl/
│   ├── extract.py
│   ├── transform.py
│   └── load.py
│
├── data/
│   ├── raw/
│   └── processed/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── assets/
│
├── run_pipeline.py
├── requirements.txt
└── README.md
```

---

## Future Improvements

* Advanced player statistics
* Search functionality
* League comparison dashboard
* Team comparison dashboard
* Data visualizations
* Historical trend analysis
* Dark mode
* Caching layer using Redis
* Airflow orchestration
* Docker containerization
* CI/CD pipeline using GitHub Actions

---
## Author

**Harshan**
GitHub: `Harshan07-web`

---
