import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/footballApi";

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
    return { text: status ?? "—", type: "upcoming" };
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
}

function ScoreBlock({ label, home, away }) {
    if (home == null && away == null) return null;
    return (
        <div className="meta-row">
            <dt>{label}</dt>
            <dd>{home ?? 0} – {away ?? 0}</dd>
        </div>
    );
}

function ResultPage() {

    const { fixtureId } = useParams();
    const { state }     = useLocation();

    const [fixture,  setFixture]  = useState(state?.fixture  ?? null);
    const [teamMap,  setTeamMap]  = useState(state?.teamMap  ?? {});
    const [loading,  setLoading]  = useState(!state?.fixture);

    useEffect(() => {
        if (!state?.fixture) fetchFixture();
    }, [fixtureId]);

    async function fetchFixture() {

        try {

            setLoading(true);

            const res = await api.get(`/fetch_fixture/${fixtureId}`);
            setFixture(res.data);

            // if we have no team map, try to fetch teams for this league
            if (res.data?.league_id) {
                const teamsRes = await api.get(`/teams/${res.data.league_id}`);
                const map = {};
                for (const t of teamsRes.data) {
                    map[t.team_id] = { name: t.team, logo: t.logo };
                }
                setTeamMap(map);
            }

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    }

    if (loading)   return <p className="state">Loading match...</p>;
    if (!fixture)  return <p className="state">Match not found.</p>;

    const home   = teamMap[fixture.home_id] ?? { name: `Team ${fixture.home_id}`, logo: null };
    const away   = teamMap[fixture.away_id] ?? { name: `Team ${fixture.away_id}`, logo: null };
    const status = getStatusLabel(fixture.status);
    const isDone = status.type === "done";

    const hasET  = fixture.et_home_goals  != null || fixture.et_away_goals  != null;
    const hasPen = fixture.pen_home_goals != null || fixture.pen_away_goals != null;

    return (

        <div className="page">

            {/* Match hero */}
            <div className="match-hero">

                <div className="match-team match-team--home">
                    <div className="badge badge-lg">
                        {home.logo && <img src={home.logo} alt={home.name} />}
                    </div>
                    <h2>{home.name}</h2>
                </div>

                <div className="match-center">
                    {isDone ? (
                        <>
                            <div className="match-score">
                                {fixture.ft_home_goals} — {fixture.ft_away_goals}
                            </div>
                            <div className={`fixture-status fixture-status--${status.type}`}>
                                {status.text}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="match-vs">vs</div>
                            <div className={`fixture-status fixture-status--${status.type}`}>
                                {status.text}
                            </div>
                        </>
                    )}
                </div>

                <div className="match-team match-team--away">
                    <div className="badge badge-lg">
                        {away.logo && <img src={away.logo} alt={away.name} />}
                    </div>
                    <h2>{away.name}</h2>
                </div>

            </div>

            {/* Match meta */}
            <dl className="meta-list">

                <div className="meta-row">
                    <dt>Date</dt>
                    <dd>{formatDate(fixture.date)}</dd>
                </div>

                <div className="meta-row">
                    <dt>Round</dt>
                    <dd>{fixture.league_round ?? "—"}</dd>
                </div>

                <div className="meta-row">
                    <dt>Referee</dt>
                    <dd>{fixture.referee ?? "—"}</dd>
                </div>

                <div className="meta-row">
                    <dt>Status</dt>
                    <dd>{fixture.status ?? "—"}</dd>
                </div>

                <ScoreBlock
                    label="Half Time"
                    home={fixture.ht_home_goals}
                    away={fixture.ht_away_goals}
                />

                <ScoreBlock
                    label="Full Time"
                    home={fixture.ft_home_goals}
                    away={fixture.ft_away_goals}
                />

                {hasET && (
                    <ScoreBlock
                        label="Extra Time"
                        home={fixture.et_home_goals}
                        away={fixture.et_away_goals}
                    />
                )}

                {hasPen && (
                    <ScoreBlock
                        label="Penalties"
                        home={fixture.pen_home_goals}
                        away={fixture.pen_away_goals}
                    />
                )}

                <div className="meta-row">
                    <dt>1st Period</dt>
                    <dd>{fixture.first_period != null ? `${fixture.first_period}'` : "—"}</dd>
                </div>

                <div className="meta-row">
                    <dt>2nd Period</dt>
                    <dd>{fixture.second_period != null ? `${fixture.second_period}'` : "—"}</dd>
                </div>

            </dl>

        </div>

    );
}

export default ResultPage;