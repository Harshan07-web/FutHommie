import { useEffect, useState } from "react";
import api from "../api/footballApi";

const WORLD_CUP_ID = 2000;

const KNOCKOUT_ORDER = [
    "LAST_32",
    "LAST_16",
    "QUARTER_FINALS",
    "SEMI_FINALS",
    "FINAL",
];

const KNOCKOUT_LABELS = {
    LAST_32:        "Round of 32",
    LAST_16:        "Round of 16",
    QUARTER_FINALS: "Quarter-Finals",
    SEMI_FINALS:    "Semi-Finals",
    FINAL:          "Final",
};

const THIRD_PLACE_STAGES = ["THIRD_PLACE", "THIRD_PLACE_PLAYOFF", "3RD_PLACE"];

function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isFinished(status) {
    return (status ?? "").toUpperCase() === "FINISHED";
}

function isGroupStage(m) {
    return Boolean(m.group) || (m.stage ?? "").toUpperCase().includes("GROUP");
}

function isThirdPlace(m) {
    return THIRD_PLACE_STAGES.includes((m.stage ?? "").toUpperCase());
}

function isKnockout(m) {
    return !isGroupStage(m) && !isThirdPlace(m);
}

function groupByMatchday(matches) {
    return matches.reduce((acc, m) => {
        const key = m.matchday ?? "Unknown";
        if (!acc[key]) acc[key] = [];
        acc[key].push(m);
        return acc;
    }, {});
}

function groupByStageKey(matches) {
    return matches.reduce((acc, m) => {
        const key = (m.stage ?? "Unknown").toUpperCase();
        if (!acc[key]) acc[key] = [];
        acc[key].push(m);
        return acc;
    }, {});
}

function MatchCard({ m, teamMap, compact }) {

    const home = teamMap[m.home_id] ?? { name: `Team ${m.home_id}`, logo: null };
    const away = teamMap[m.away_id] ?? { name: `Team ${m.away_id}`, logo: null };
    const done = isFinished(m.status);

    if (compact) {
        return (

            <div className="bracket-match">

                <div className="bracket-team-row">
                    <div className="badge badge-sm">
                        {home.logo && <img src={home.logo} alt={home.name} />}
                    </div>
                    <span className="bracket-team-name">{home.name}</span>
                    {done && <span className="bracket-team-score">{m.ft_home_goals}</span>}
                </div>

                <div className="bracket-team-row">
                    <div className="badge badge-sm">
                        {away.logo && <img src={away.logo} alt={away.name} />}
                    </div>
                    <span className="bracket-team-name">{away.name}</span>
                    {done && <span className="bracket-team-score">{m.ft_away_goals}</span>}
                </div>

                {!done && (
                    <div className="bracket-date">{formatDate(m.date)}</div>
                )}

            </div>

        );
    }

    return (

        <div className="fixture-card">

            <div className="fixture-team fixture-home">
                <span className="fixture-team-name">{home.name}</span>
                <div className="badge badge-sm">
                    {home.logo && <img src={home.logo} alt={home.name} />}
                </div>
            </div>

            <div className="fixture-center">
                {done ? (
                    <>
                        <div className="fixture-score">
                            <span>{m.ft_home_goals}</span>
                            <span className="fixture-score-sep">—</span>
                            <span>{m.ft_away_goals}</span>
                        </div>
                        <div className="fixture-status fixture-status--done">FT</div>
                    </>
                ) : (
                    <>
                        <div className="fixture-vs">vs</div>
                        <div className="fixture-date">{formatDate(m.date)}</div>
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
}

function GroupStageView({ matches, teamMap }) {

    const grouped = groupByMatchday(matches);
    const matchdays = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

    if (matchdays.length === 0) {
        return <p className="state">No group stage matches.</p>;
    }

    return matchdays.map(md => (

        <div key={md} className="fixture-group">

            <div className="fixture-group-header">
                <span>{md === "Unknown" ? "Matchday" : `Matchday ${md}`}</span>
            </div>

            <div className="fixture-list">

                {matches
                    .filter(m => String(m.matchday ?? "Unknown") === md)
                    .sort((a, b) => (a.group ?? "").localeCompare(b.group ?? ""))
                    .map(m => (
                        <div key={m.fixture_id} className="fixture-row-wrap">
                            {m.group && (
                                <span className="fixture-group-tag">
                                    {m.group.replace(/^GROUP[_\s]?/i, "")}
                                </span>
                            )}
                            <MatchCard m={m} teamMap={teamMap} />
                        </div>
                    ))}

            </div>

        </div>

    ));
}

function UpcomingListView({ matches, teamMap }) {

    if (matches.length === 0) {
        return <p className="state">No upcoming matches.</p>;
    }

    const sorted = [...matches].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    return (
        <div className="fixture-list">
            {sorted.map(m => (
                <MatchCard key={m.fixture_id} m={m} teamMap={teamMap} />
            ))}
        </div>
    );
}

function BracketView({ matches, teamMap }) {

    const grouped = groupByStageKey(matches);
    const rounds  = KNOCKOUT_ORDER.filter(stage => grouped[stage]?.length);

    if (rounds.length === 0) {
        return <p className="state">No knockout matches found.</p>;
    }

    return (

        <div className="bracket-wrap">

            <div className="bracket">

                {rounds.map((stage, idx) => (

                    <div
                        key={stage}
                        className="bracket-round"
                        style={{ "--round-index": idx }}
                    >

                        <div className="bracket-round-title">
                            {KNOCKOUT_LABELS[stage]}
                        </div>

                        <div className="bracket-round-matches">

                            {grouped[stage].map(m => (
                                <MatchCard key={m.fixture_id} m={m} teamMap={teamMap} compact />
                            ))}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}

function WorldCupPage() {

    const [tab, setTab]         = useState("results");
    const [comp, setComp]       = useState(null);
    const [matches, setMatches] = useState([]);
    const [teamMap, setTeamMap] = useState({});
    const [scorers, setScorers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBase();
    }, []);

    async function fetchBase() {

        try {

            setLoading(true);

            const [compsRes, matchesRes, teamsRes, scorersRes] = await Promise.all([
                api.get(`/dataorg/competitions`),
                api.get(`/dataorg/matches`),
                api.get(`/dataorg/teams`),
                api.get(`/dataorg/scorers/${WORLD_CUP_ID}`).catch(() => ({ data: [] })),
            ]);

            const wcComp = (compsRes.data ?? []).find(c => c.league_id === WORLD_CUP_ID);
            setComp(wcComp ?? null);

            const wcMatches = (matchesRes.data ?? []).filter(
                m => m.competition_id === WORLD_CUP_ID
            );
            setMatches(wcMatches);

            const map = {};
            for (const t of (teamsRes.data ?? [])) {
                map[t.team_id] = { name: t.name, logo: t.logo };
            }
            setTeamMap(map);

            setScorers(scorersRes.data ?? []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    }

    // Results — finished GROUP STAGE matches only (knockout lives in its own tab)
    const groupResults = matches.filter(m => isFinished(m.status) && isGroupStage(m));

    // Fixtures — all upcoming matches (group + knockout), simple chronological list
    const upcoming = matches.filter(m => !isFinished(m.status));

    // Knockout — every knockout match regardless of status, shown as a bracket
    const knockoutMatches   = matches.filter(isKnockout);
    const thirdPlaceMatches = matches.filter(isThirdPlace);

    return (

        <div className="page">

            <div className="detail-header">

                <div className="badge badge-lg">
                    {comp?.logo && <img src={comp.logo} alt={comp.name} />}
                </div>

                <h1>{comp?.name ?? "World Cup"}</h1>

            </div>

            <div className="btn-group">
                <button className={tab === "results"   ? "active" : ""} onClick={() => setTab("results")}>Results</button>
                <button className={tab === "fixtures"   ? "active" : ""} onClick={() => setTab("fixtures")}>Fixtures</button>
                <button className={tab === "knockout"   ? "active" : ""} onClick={() => setTab("knockout")}>Knockout</button>
                <button className={tab === "scorers"    ? "active" : ""} onClick={() => setTab("scorers")}>Top Scorers</button>
            </div>

            {loading ? (

                <p className="state">Loading...</p>

            ) : tab === "results" ? (

                <>
                    <div className="section-heading">
                        <h2>Group Stage Results</h2>
                    </div>
                    <GroupStageView matches={groupResults} teamMap={teamMap} />
                </>

            ) : tab === "fixtures" ? (

                <>
                    <div className="section-heading">
                        <h2>Upcoming Matches</h2>
                    </div>
                    <UpcomingListView matches={upcoming} teamMap={teamMap} />
                </>

            ) : tab === "knockout" ? (

                <>
                    <div className="section-heading">
                        <h2>Knockout Stage</h2>
                    </div>
                    <BracketView matches={knockoutMatches} teamMap={teamMap} />

                    {thirdPlaceMatches.length > 0 && (
                        <>
                            <div className="section-heading">
                                <h2>Third Place Playoff</h2>
                            </div>
                            <div className="fixture-list">
                                {thirdPlaceMatches.map(m => (
                                    <MatchCard key={m.fixture_id} m={m} teamMap={teamMap} />
                                ))}
                            </div>
                        </>
                    )}
                </>

            ) : (

                scorers.length === 0 ? (

                    <p className="state">No scorer data found.</p>

                ) : (

                    <div className="table-wrap" style={{ marginTop: 20 }}>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: 40 }}>#</th>
                                    <th style={{ textAlign: "left" }}>Player</th>
                                    <th style={{ textAlign: "left" }}>Team</th>
                                    <th>Pos</th>
                                    <th>Apps</th>
                                    <th>Goals</th>
                                    <th>Assists</th>
                                    <th>Penalties</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scorers.map((p, i) => (
                                    <tr key={p.id}>
                                        <td className="num lb-rank">{i + 1}</td>
                                        <td>
                                            <div className="lb-player">
                                                <span className="lb-name">{p.player_name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="lb-team">
                                                <span>{p.team_name}</span>
                                            </div>
                                        </td>
                                        <td className="num">{p.section ?? "—"}</td>
                                        <td className="num">{p.played_matches ?? "—"}</td>
                                        <td className="lb-stat-primary num">{p.goals ?? 0}</td>
                                        <td className="num">{p.assists ?? 0}</td>
                                        <td className="num">{p.penalties ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )

            )}

        </div>

    );
}

export default WorldCupPage;