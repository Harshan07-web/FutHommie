import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/footballApi";

const LEAGUES = [
    { id: 39,  name: "Premier League" },
    { id: 140, name: "La Liga" },
    { id: 78,  name: "Bundesliga" },
    { id: 135, name: "Serie A" },
    { id: 61,  name: "Ligue 1" },
];

const SEASONS = [2022, 2023, 2024];

function getStatusLabel(status) {
    const s = (status ?? "").toLowerCase();
    if (s.includes("finished") || s === "ft")      return { text: "FT",   type: "done" };
    if (s.includes("halftime") || s === "ht")       return { text: "HT",   type: "live" };
    if (s.includes("first half")  || s === "1h")    return { text: "LIVE", type: "live" };
    if (s.includes("second half") || s === "2h")    return { text: "LIVE", type: "live" };
    if (s.includes("extra time")  || s === "et")    return { text: "ET",   type: "live" };
    if (s.includes("penalty")     || s === "p")     return { text: "PEN",  type: "live" };
    if (s.includes("postponed")   || s === "pst")   return { text: "PST",  type: "cancelled" };
    if (s.includes("cancel")      || s === "canc")  return { text: "CANC", type: "cancelled" };
    return { text: "—", type: "upcoming" };
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function groupByRound(fixtures) {
    return fixtures.reduce((acc, f) => {
        const round = f.league_round ?? "Unknown Round";
        if (!acc[round]) acc[round] = [];
        acc[round].push(f);
        return acc;
    }, {});
}

function ResultsPage() {

    const navigate = useNavigate();

    const [league, setLeague] = useState(39);
    const [season, setSeason] = useState(2024);
    const [fixtures, setFixtures] = useState([]);
    const [teamMap, setTeamMap] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [league, season]);

    async function fetchData() {

        try {

            setLoading(true);

            const [fixturesRes, teamsRes] = await Promise.all([
                api.get(`/fetch_fixtures/${league}/${season}`),
                api.get(`/teams/${league}`),
            ]);

            setFixtures(fixturesRes.data);

            // build id → { team, logo } lookup
            const map = {};
            for (const t of teamsRes.data) {
                map[t.team_id] = { name: t.team, logo: t.logo };
            }
            setTeamMap(map);

        } catch (err) {

            console.error(err);
            setFixtures([]);

        } finally {

            setLoading(false);

        }
    }

    const grouped = groupByRound(fixtures);
    const rounds  = Object.keys(grouped);

    return (

        <div className="page">

            <div className="page-header">
                <span className="eyebrow">Matches</span>
                <h1>Fixtures</h1>
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

                <p className="state">Loading fixtures...</p>

            ) : rounds.length === 0 ? (

                <p className="state">No fixtures found.</p>

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
                                const status = getStatusLabel(fixture.status);
                                const isDone = status.type === "done";

                                return (

                                    <div
                                        key={fixture.fixture_id}
                                        className="fixture-card"
                                        onClick={() => navigate(`/results/${fixture.fixture_id}`, {
                                            state: { fixture, teamMap }
                                        })}
                                    >

                                        {/* Home team */}
                                        <div className="fixture-team fixture-home">
                                            <span className="fixture-team-name">{home.name}</span>
                                            <div className="badge badge-sm">
                                                {home.logo && <img src={home.logo} alt={home.name} />}
                                            </div>
                                        </div>

                                        {/* Score / status center */}
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

                                        {/* Away team */}
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