import { useState } from "react";

// UI-only for now — picks live in local state and reset on refresh.
// Wire this up to a real endpoint once there's somewhere to store picks.
function PredictionCard({ fixtures, teamMap }) {

    const [picks, setPicks] = useState({});

    const matches = (fixtures ?? []).slice(0, 2);

    function pick(fixtureId, side) {
        setPicks(prev => ({ ...prev, [fixtureId]: side }));
    }

    return (

        <div className="dashboard-widget prediction-card">

            <div className="widget-header">
                <h2>Predict the Winner</h2>
            </div>

            {matches.length === 0 ? (
                <p className="state">No upcoming fixtures to predict yet.</p>
            ) : (
                matches.map(f => {
                    const home = teamMap[f.home_id] ?? { name: `Team ${f.home_id}`, tla: null };
                    const away = teamMap[f.away_id] ?? { name: `Team ${f.away_id}`, tla: null };
                    const selected = picks[f.fixture_id];

                    return (
                        <div key={f.fixture_id} className="prediction-match">
                            <div className="prediction-teams">
                                {home.name} <span className="prediction-vs">vs</span> {away.name}
                            </div>
                            <div className="prediction-options">
                                <button
                                    className={selected === "home" ? "active" : ""}
                                    onClick={() => pick(f.fixture_id, "home")}
                                >
                                    {home.tla || home.name.split(" ")[0]}
                                </button>
                                <button
                                    className={selected === "draw" ? "active" : ""}
                                    onClick={() => pick(f.fixture_id, "draw")}
                                >
                                    Draw
                                </button>
                                <button
                                    className={selected === "away" ? "active" : ""}
                                    onClick={() => pick(f.fixture_id, "away")}
                                >
                                    {away.tla || away.name.split(" ")[0]}
                                </button>
                            </div>
                        </div>
                    );
                })
            )}

        </div>

    );
}

export default PredictionCard;