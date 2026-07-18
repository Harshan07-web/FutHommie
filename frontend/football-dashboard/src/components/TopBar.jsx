import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
    { label: "Teams",   route: "/teams" },
    { label: "Squads",  route: "/players" },
    { label: "Venues",  route: "/venues" },
    { label: "Results", route: "/results" },
];

function TopBar() {

    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState("");

    const isHome = location.pathname === "/";

    function handleSearchSubmit(e) {
        e.preventDefault();
        const term = query.trim();
        if (!term) return;
        // TODO: wire to a real search endpoint once one exists —
        // routing to /teams as a temporary landing spot for now.
        navigate(`/teams?q=${encodeURIComponent(term)}`);
    }

    return (

        <div className="topbar">

            <div className="topbar-left">

                <Link
                    to="/"
                    className="topbar-brand"
                >
                    <span className="mark">F</span>
                    <span className="brand-text">FutHommie</span>
                </Link>

                {!isHome && (
                    <button
                        className="topbar-back"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                )}

            </div>

            <form className="topbar-search" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search teams, players, leagues..."
                />
            </form>

            <nav className="topbar-nav">
                {NAV_LINKS.map(link => (
                    <Link
                        key={link.route}
                        to={link.route}
                        className={"topbar-nav-link" + (location.pathname.startsWith(link.route) ? " active" : "")}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

        </div>

    );
}

export default TopBar;