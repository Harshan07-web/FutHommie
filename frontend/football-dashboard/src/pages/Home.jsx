import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/footballApi";
import StandingsTable from "../components/StandingsTable";
import Marquee from "../components/Marquee";
import Countdown from "../components/Countdown";
import PredictionCard from "../components/PredictionCard";

const LEAGUES = [
    { id: 39,  doId: 2021, short: "EPL",     name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
    { id: 140, doId: 2014, short: "LA LIGA", name: "La Liga",         logo: "https://media.api-sports.io/football/leagues/140.png" },
    { id: 78,  doId: 2002, short: "BUNDES",  name: "Bundesliga",      logo: "https://media.api-sports.io/football/leagues/78.png" },
    { id: 135, doId: 2019, short: "SERIE A", name: "Serie A",         logo: "https://media.api-sports.io/football/leagues/135.png" },
    { id: 61,  doId: 2015, short: "LIGUE 1", name: "Ligue 1",         logo: "https://media.api-sports.io/football/leagues/61.png" },
    // NOTE: doId here follows football-data.org's usual code (CL=2001) but isn't
    // confirmed against your dataorg ingest yet — verify before relying on it.
    { id: 2,   doId: 2001, short: "UCL",     name: "Champions League", logo: "https://media.api-sports.io/football/leagues/2.png" },
];

const SEASON = 2026;

const WORLD_CUP_ID = 2000;
const THIRD_PLACE_STAGES = ["THIRD_PLACE", "THIRD_PLACE_PLAYOFF", "3RD_PLACE"];

// Fallback dates if the matches haven't landed in dataorg yet (confirmed 2026 schedule).
const WC_THIRD_PLACE_ISO_FALLBACK = "2026-07-18T21:00:00Z"; // Miami Stadium, 5pm ET
const WC_FINAL_ISO_FALLBACK       = "2026-07-19T19:00:00Z"; // MetLife Stadium, 3pm ET

const sections = [
    {
        label: "Standings",
        cards: [
            { title: "Home Form",      description: "League table ranked exclusively by home record",           route: "/home-standings" },
            { title: "Away Form",      description: "League table ranked exclusively by away record",           route: "/away-standings" },
            { title: "Form Table",     description: "Clubs ranked by form across their last 5 matches",         route: "/form-table" },
        ]
    },
    {
        label: "Clubs & Competitions",
        cards: [
            { title: "Teams",          description: "Browse every club by league and season",                   route: "/teams" },
            { title: "Team Stats",     description: "Detailed performance metrics per club",                    route: "/team-stats" },
            { title: "Season Stats",   description: "Aggregated team performance data across the season",       route: "/season-stats" },
            { title: "Leagues",        description: "All competitions and tournaments tracked in the database", route: "/leagues" },
        ]
    },
    {
        label: "Players",
        cards: [
            { title: "Squads",         description: "Full squad rosters with player profiles and positions",    route: "/players" },
            { title: "Top Scorers",    description: "Golden boot rankings by player and club per league",       route: "/top-scorers" },
            { title: "Top Assists",    description: "Most assists — playmakers ranked across each league",      route: "/top-assists" },
            { title: "Yellow Cards",   description: "Disciplinary rankings — most bookings by league",         route: "/top-yellow-cards" },
            { title: "Red Cards",      description: "Most dismissals per player, club and league",              route: "/top-red-cards" },
            { title: "Injuries",       description: "Current and historical injury reports across all squads",  route: "/injuries" },
            { title: "Transfers",      description: "Player transfer activity by club and window",              route: "/transfers" },
        ]
    },
    {
        label: "Matches",
        cards: [
            { title: "Results",        description: "Recent match results, final scores and goalscorers",       route: "/results" },
            { title: "Live Scores",    description: "Live match data and in-game stats updated in real time",   route: "/live" },
            { title: "Lineups",        description: "Starting XIs, formations and substitutes per fixture",     route: "/lineups" },
            { title: "Head to Head",   description: "Historical results between any two clubs",                 route: "/h2h" },
        ]
    },
    {
        label: "Venues & Intelligence",
        cards: [
            { title: "Stadiums",       description: "Stadium capacity, surface type and location data",         route: "/venues" },
            { title: "Clean Sheets",   description: "Most clean sheets ranked by goalkeeper and club",          route: "/clean-sheets" },
        ]
    },
];

function getStatusLabel(status) {
    const s = (status ?? "").toUpperCase();
    if (s === "FINISHED")         return { text: "FT",   type: "done" };
    if (s === "IN_PLAY")          return { text: "LIVE", type: "live" };
    if (s === "PAUSED")           return { text: "HT",   type: "live" };
    if (s === "EXTRA_TIME")       return { text: "ET",   type: "live" };
    if (s === "PENALTY_SHOOTOUT") return { text: "PEN",  type: "live" };
    if (s === "POSTPONED")        return { text: "PST",  type: "cancelled" };
    if (s === "CANCELLED")        return { text: "CANC", type: "cancelled" };
    return { text: "—", type: "upcoming" };
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function Home() {

    const navigate = useNavigate();

    const [leagueId, setLeagueId] = useState(39);
    const [fixtures, setFixtures] = useState([]);
    const [standings, setStandings] = useState([]);
    const [teamMap, setTeamMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [wcMatches, setWcMatches] = useState([]);
    const [wcTeamMap, setWcTeamMap] = useState({});

    const league = LEAGUES.find(l => l.id === leagueId);

    useEffect(() => {
        fetchDashboard();
    }, [leagueId]);

    useEffect(() => {
        fetchWorldCup();
    }, []);

    async function fetchWorldCup() {
        try {
            const [matchesRes, teamsRes] = await Promise.all([
                api.get(`/dataorg/matches/${WORLD_CUP_ID}/${SEASON}`),
                api.get(`/dataorg/teams`),
            ]);

            setWcMatches(matchesRes.data ?? []);

            const map = {};
            for (const t of (teamsRes.data ?? [])) {
                map[t.team_id] = { name: t.name, logo: t.logo, tla: t.tla };
            }
            setWcTeamMap(map);

        } catch (err) {
            console.error(err);
            setWcMatches([]);
        }
    }

    async function fetchDashboard() {
        try {
            setLoading(true);

            const [matchesRes, teamsRes, standingsRes] = await Promise.all([
                api.get(`/dataorg/matches/${league.doId}/${SEASON}`),
                api.get(`/dataorg/teams`),
                api.get(`/dataorg/standings/${SEASON}/${league.doId}`),
            ]);

            const map = {};
            for (const t of (teamsRes.data ?? [])) {
                map[t.team_id] = { name: t.name, logo: t.logo, tla: t.tla };
            }
            setTeamMap(map);

            const upcoming = (matchesRes.data ?? [])
                .filter(m => getStatusLabel(m.status).type !== "done")
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 8);
            setFixtures(upcoming);

            setStandings((standingsRes.data ?? []).slice(0, 10));

        } catch (err) {
            console.error(err);
            setFixtures([]);
            setStandings([]);
        } finally {
            setLoading(false);
        }
    }

    const marqueeItems = [
        ...LEAGUES.map(l => ({ name: l.short, logo: l.logo })),
        // s.tla depends on your standings endpoint also serializing it —
        // falls back to full team name if it isn't there.
        ...standings.map(s => ({ name: s.tla || s.team, logo: s.logo })).filter(t => t.logo),
    ];

    const finalMatch = wcMatches.find(m => (m.stage ?? "").toUpperCase() === "FINAL");
    const thirdPlaceMatch = wcMatches.find(m => THIRD_PLACE_STAGES.includes((m.stage ?? "").toUpperCase()));

    const finalHome = finalMatch ? wcTeamMap[finalMatch.home_id] : null;
    const finalAway = finalMatch ? wcTeamMap[finalMatch.away_id] : null;
    const thirdHome = thirdPlaceMatch ? wcTeamMap[thirdPlaceMatch.home_id] : null;
    const thirdAway = thirdPlaceMatch ? wcTeamMap[thirdPlaceMatch.away_id] : null;

    return (

        <>

            <div className="home-hero">

                <div className="home-hero-inner">

                    <span className="eyebrow">FutHommie</span>

                    <h1>
                        Europe's top leagues,<br />
                        <span className="accent">all in one place.</span>
                    </h1>

                    <p>
                        Standings, squads, venues and player stats
                        across the Premier League, La Liga, Bundesliga,
                        Serie A and Ligue 1.
                    </p>

                </div>

            </div>

            <Marquee items={marqueeItems} />

            <div className="page page-wide">

                <div className="feature-row">

                    <div
                        className="nav-card wc-hub-card"
                        onClick={() => navigate("/world-cup")}
                    >
                        <h3>World Cup Hub</h3>
                        <p>Fixtures, results and top scorers — all in one place</p>
                    </div>

                    <div className="dashboard-widget countdown-card">
                        <div className="widget-header">
                            <h2>2026 World Cup — Final Stretch</h2>
                        </div>
                        <Countdown
                            title="Third-Place Playoff"
                            venue="Miami Stadium"
                            home={thirdHome}
                            away={thirdAway}
                            targetISO={thirdPlaceMatch?.date ?? WC_THIRD_PLACE_ISO_FALLBACK}
                        />
                        <Countdown
                            title="Final"
                            venue="MetLife Stadium, East Rutherford"
                            home={finalHome}
                            away={finalAway}
                            targetISO={finalMatch?.date ?? WC_FINAL_ISO_FALLBACK}
                        />
                    </div>

                </div>

                <div className="btn-group league-tabs">
                    {LEAGUES.map(l => (
                        <button
                            key={l.id}
                            className={l.id === leagueId ? "active" : ""}
                            onClick={() => setLeagueId(l.id)}
                        >
                            {l.short}
                        </button>
                    ))}
                </div>

                <div className="dashboard-grid-3">

                    <div className="dashboard-widget">

                        <div className="widget-header">
                            <h2>Upcoming — {league.name}</h2>
                            <span className="widget-link" onClick={() => navigate("/fixtures")}>
                                See all →
                            </span>
                        </div>

                        {loading ? (
                            <p className="state">Loading...</p>
                        ) : fixtures.length === 0 ? (
                            <p className="state">No upcoming fixtures.</p>
                        ) : (
                            <div className="fixture-list">
                                {fixtures.map(f => {
                                    const home = teamMap[f.home_id] ?? { name: `Team ${f.home_id}`, logo: null, tla: null };
                                    const away = teamMap[f.away_id] ?? { name: `Team ${f.away_id}`, logo: null, tla: null };
                                    const status = getStatusLabel(f.status);

                                    return (
                                        <div
                                            key={f.fixture_id}
                                            className="fixture-card"
                                            onClick={() => navigate(`/fixtures/${f.fixture_id}`, {
                                                state: { fixture: f, teamMap }
                                            })}
                                        >
                                            <div className="fixture-team fixture-home">
                                                <span className="fixture-team-name">{home.tla || home.name}</span>
                                                <div className="badge badge-sm">
                                                    {home.logo && <img src={home.logo} alt={home.tla || home.name} />}
                                                </div>
                                            </div>
                                            <div className="fixture-center">
                                                <div className="fixture-vs">vs</div>
                                                <div className="fixture-date">{formatDate(f.date)}</div>
                                                {status.type !== "upcoming" && (
                                                    <div className={`fixture-status fixture-status--${status.type}`}>
                                                        {status.text}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="fixture-team fixture-away">
                                                <div className="badge badge-sm">
                                                    {away.logo && <img src={away.logo} alt={away.tla || away.name} />}
                                                </div>
                                                <span className="fixture-team-name">{away.tla || away.name}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>

                    <div className="dashboard-widget">

                        <div className="widget-header">
                            <h2>Table — {league.name}</h2>
                            <span className="widget-link" onClick={() => navigate("/standings")}>
                                Full table →
                            </span>
                        </div>

                        {loading ? (
                            <p className="state">Loading...</p>
                        ) : (
                            <StandingsTable standings={standings} teamMap={teamMap} />
                        )}

                    </div>

                    <div className="dashboard-stack">

                        <div className="dashboard-widget top-leagues-card">
                            <div className="widget-header">
                                <h2>Top Leagues</h2>
                            </div>
                            <div className="top-leagues-list">
                                {LEAGUES.map(l => (
                                    <div
                                        key={l.id}
                                        className={"top-league-item" + (l.id === leagueId ? " active" : "")}
                                        onClick={() => navigate(`/league/${l.id}`)}
                                    >
                                        <div className="badge badge-sm">
                                            <img src={l.logo} alt={l.name} />
                                        </div>
                                        <span>{l.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <PredictionCard fixtures={fixtures} teamMap={teamMap} />

                    </div>

                </div>

                {sections.map((section) => (

                    <div key={section.label} className="home-section">

                        <div className="home-section-label">
                            <span>{section.label}</span>
                        </div>

                        <div className="nav-grid">

                            {section.cards.map((card) => (

                                <div
                                    key={card.title}
                                    className="nav-card"
                                    onClick={() => navigate(card.route)}
                                >

                                    <h3>{card.title}</h3>

                                    <p>{card.description}</p>

                                </div>

                            ))}

                        </div>

                    </div>

                ))}

            </div>
            <footer className="footer">
            <div className="footer-links">
                <span>Built by Harshan B  </span>

                <a
                href="https://github.com/Harshan07-web/premier_league_elt.git"
                target="_blank"
                rel="noopener noreferrer"
                >
                repo
                </a>
                  <a
                href="https://github.com/Harshan07-web"
                target="_blank"
                rel="noopener noreferrer"
                >
                GitHub 
                </a>
            </div>
            </footer>

        </>

    );
}

export default Home;