import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/footballApi";

// Added logos to match the Standings page
const LEAGUES = [
    { id: 39,  name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
    { id: 140, name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png" },
    { id: 78,  name: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png" },
    { id: 135, name: "Serie A", logo: "https://media.api-sports.io/football/leagues/135.png" },
    { id: 61,  name: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png" },
];

const SEASONS = [2022, 2023, 2024, 2025];

const LEAGUE_TO_DATAORG_COMP = {
    39:  2021,
    140: 2014,
    78:  2002,
    135: 2019,
    61:  2015,
};

function getStatusLabel(status, source) {
    if (source === "dataorg") {
        const s = (status ?? "").toUpperCase();
        if (s === "FINISHED")             return { text: "FT",   type: "done" };
        if (s === "IN_PLAY")              return { text: "LIVE", type: "live" };
        if (s === "PAUSED")               return { text: "HT",   type: "live" };
        if (s === "EXTRA_TIME")           return { text: "ET",   type: "live" };
        if (s === "PENALTY_SHOOTOUT")     return { text: "PEN",  type: "live" };
        if (s === "POSTPONED")            return { text: "PST",  type: "cancelled" };
        if (s === "CANCELLED")            return { text: "CANC", type: "cancelled" };
        return { text: "—", type: "upcoming" };
    }

    const s = (status ?? "").toLowerCase();
    if (s.includes("finished") || s === "ft")     return { text: "FT",   type: "done" };
    if (s.includes("halftime") || s === "ht")      return { text: "HT",   type: "live" };
    if (s.includes("first half")  || s === "1h")   return { text: "LIVE", type: "live" };
    if (s.includes("second half") || s === "2h")   return { text: "LIVE", type: "live" };
    if (s.includes("extra time")  || s === "et")   return { text: "ET",   type: "live" };
    if (s.includes("penalty")     || s === "p")    return { text: "PEN",  type: "live" };
    if (s.includes("postponed")   || s === "pst")  return { text: "PST",  type: "cancelled" };
    if (s.includes("cancel")      || s === "canc") return { text: "CANC", type: "cancelled" };
    return { text: "—", type: "upcoming" };
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function normaliseApiFootball(fixtures) {
    return fixtures.map(f => ({
        fixture_id:    f.fixture_id,
        round:         f.league_round ?? "Unknown Round",
        date:          f.date,
        status:        f.status,
        source:        "apifootball",
        home_id:       f.home_id,
        away_id:       f.away_id,
        ft_home_goals: f.ft_home_goals,
        ft_away_goals: f.ft_away_goals,
        ht_home_goals: f.ht_home_goals,
        ht_away_goals: f.ht_away_goals,
    }));
}

function normaliseDataOrg(matches) {
    return matches.map(m => ({
            fixture_id:    m.fixture_id,
            round:         m.matchday != null ? `Matchday ${m.matchday}` : (m.stage ?? "Unknown Round"),
            date:          m.date,
            status:        m.status,
            source:        "dataorg",
            home_id:       m.home_id,
            away_id:       m.away_id,
            ft_home_goals: m.ft_home_goals,
            ft_away_goals: m.ft_away_goals,
            ht_home_goals: m.ht_home_goals,
            ht_away_goals: m.ht_away_goals,
        }));
}

function groupByRound(fixtures) {
    return fixtures.reduce((acc, f) => {
        const round = f.round ?? "Unknown Round";
        if (!acc[round]) acc[round] = [];
        acc[round].push(f);
        return acc;
    }, {});
}

function ResultsPage() {
    const navigate = useNavigate();

    const [league,   setLeague]   = useState(39);
    const [season,   setSeason]   = useState(2024);
    const [fixtures, setFixtures] = useState([]);
    const [teamMap,  setTeamMap]  = useState({});
    const [loading,  setLoading]  = useState(false);

    const isDataOrg = season >= 2025;

    useEffect(() => {
        fetchData();
    }, [league, season]);

    async function fetchData() {
        try {
            setLoading(true);
            setFixtures([]);

            let normalised = [];

            if (isDataOrg) {
                const compId = LEAGUE_TO_DATAORG_COMP[league];
                const [matchesRes, teamsRes] = await Promise.all([
                    api.get(`/dataorg/matches/${compId}/${season}`),
                    api.get(`/dataorg/teams`),
                ]);

                normalised = normaliseDataOrg(matchesRes.data ?? []);

                const map = {};
                for (const t of (teamsRes.data ?? [])) {
                    map[t.team_id] = { name: t.name, logo: t.logo };
                }
                setTeamMap(map);

            } else {
                const [fixturesRes, teamsRes] = await Promise.all([
                    api.get(`/fetch_fixtures/${league}/${season}`),
                    api.get(`/teams/${league}`),
                ]);

                normalised = normaliseApiFootball(fixturesRes.data ?? []);

                const map = {};
                for (const t of (teamsRes.data ?? [])) {
                    map[t.team_id] = { name: t.team, logo: t.logo };
                }
                setTeamMap(map);
            }

            // FILTER: Only keep finished matches for the Results page
            const finishedMatches = normalised.filter(
                f => getStatusLabel(f.status, f.source).type === "done"
            );
            setFixtures(finishedMatches);

        } catch (err) {
            console.error(err);
            setFixtures([]);
        } finally {
            setLoading(false);
        }
    }

    const grouped = groupByRound(fixtures);
    const rounds  = Object.keys(grouped);
    const selectedLeague = LEAGUES.find((l) => l.id === league);

    return (
        <div className="page">
            
            {/* Replaced .page-header with .detail-header for the logo */}
            <div className="detail-header">
                <div className="badge badge-lg">
                    <img src={selectedLeague.logo} alt={selectedLeague.name} />
                </div>
                <h1>{selectedLeague.name} Results</h1>
            </div>

            <div className="controls">
                <select value={league} onChange={e => setLeague(Number(e.target.value))}>
                    {LEAGUES.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                </select>

                <select value={season} onChange={e => setSeason(Number(e.target.value))}>
                    {SEASONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className="state">Loading results...</p>
            ) : rounds.length === 0 ? (
                <p className="state">No results found.</p>
            ) : (
                rounds.map(round => (
                    <div key={round} className="fixture-group">
                        <div className="fixture-group-header">
                            <span>{round}</span>
                        </div>
                        <div className="fixture-list">
                            {grouped[round].map(fixture => {
                                const home   = teamMap[fixture.home_id] ?? { name: `Team ${fixture.home_id}`, logo: null };
                                const away   = teamMap[fixture.away_id] ?? { name: `Team ${fixture.away_id}`, logo: null };
                                const status = getStatusLabel(fixture.status, fixture.source);
                                const isDone = status.type === "done";

                                return (
                                    <div
                                        key={fixture.fixture_id}
                                        className="fixture-card"
                                        onClick={() => navigate(`/results/${fixture.fixture_id}`, {
                                            state: { fixture, teamMap }
                                        })}
                                    >
                                        <div className="fixture-team fixture-home">
                                            <span className="fixture-team-name">{home.name}</span>
                                            <div className="badge badge-sm">
                                                {home.logo && <img src={home.logo} alt={home.name} />}
                                            </div>
                                        </div>
                                        <div className="fixture-center">
                                            {isDone ? (
                                                <>
                                                    <div className="fixture-score">
                                                        <span>{fixture.ft_home_goals}</span>
                                                        <span className="fixture-score-sep">—</span>
                                                        <span>{fixture.ft_away_goals}</span>
                                                    </div>
                                                    <div className={`fixture-status fixture-status--${status.type}`}>
                                                        {status.text}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="fixture-vs">vs</div>
                                                    <div className="fixture-date">{formatDate(fixture.date)}</div>
                                                    {status.type !== "upcoming" && (
                                                        <div className={`fixture-status fixture-status--${status.type}`}>
                                                            {status.text}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="fixture-team fixture-away">
                                            <div className="badge badge-sm">
                                                {away.logo && <img src={away.logo} alt={away.name} />}
                                            </div>
                                            <span className="fixture-team-name">{away.name}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ResultsPage;