import { useLocation, useNavigate } from "react-router-dom";

function formatDateTime(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function FixtureDetailPage() {

    const navigate = useNavigate();
    const { state } = useLocation();

    const fixture = state?.fixture;
    const teamMap = state?.teamMap ?? {};

    if (!fixture) {
        return (
            <div className="page">
                <div className="dashboard-widget" style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
                    <h2 style={{ marginBottom: 8 }}>Fixture not found</h2>
                    <p className="state" style={{ marginTop: 0 }}>
                        Open this fixture from the Matches or Fixtures list to see its details.
                    </p>
                    <button className="topbar-back" onClick={() => navigate("/fixtures")}>
                        ← Back to fixtures
                    </button>
                </div>
            </div>
        );
    }

    const home = teamMap[fixture.home_id] ?? { name: `Team ${fixture.home_id}`, logo: null };
    const away = teamMap[fixture.away_id] ?? { name: `Team ${fixture.away_id}`, logo: null };

    return (

        <div className="page">

            <div className="dashboard-widget" style={{ maxWidth: 560, margin: "40px auto" }}>

                <div className="widget-header">
                    <h2>Fixture Details</h2>
                </div>

                <div className="fixture-card" style={{ cursor: "default" }}>
                    <div className="fixture-team fixture-home">
                        <span className="fixture-team-name">{home.name}</span>
                        <div className="badge badge-sm">
                            {home.logo && <img src={home.logo} alt={home.name} />}
                        </div>
                    </div>
                    <div className="fixture-center">
                        <div className="fixture-vs">vs</div>
                        <div className="fixture-date">{formatDateTime(fixture.date)}</div>
                    </div>
                    <div className="fixture-team fixture-away">
                        <div className="badge badge-sm">
                            {away.logo && <img src={away.logo} alt={away.name} />}
                        </div>
                        <span className="fixture-team-name">{away.name}</span>
                    </div>
                </div>

                <p className="state" style={{ marginTop: 16 }}>
                    Matchday {fixture.matchday ?? "—"} · Status: {fixture.status ?? "unknown"}
                </p>

            </div>

        </div>

    );
}

export default FixtureDetailPage;