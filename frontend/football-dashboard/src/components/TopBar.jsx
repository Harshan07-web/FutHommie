import { Link, useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
    { label: "Matches",   route: "/fixtures",  match: ["/fixtures", "/results"] },
    { label: "Standings", route: "/standings", match: ["/standings", "/home-standings", "/away-standings"] },
    { label: "Leagues",   route: "/leagues",   match: ["/leagues", "/league"] },
    { label: "Players",   route: "/players",   match: ["/players", "/player", "/top-scorers", "/top-assists"] },
    { label: "World Cup", route: "/world-cup", match: ["/world-cup"] },
];

function TopBar() {

    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === "/";

    function isActive(link) {
        return link.match.some(p => location.pathname.startsWith(p));
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

            <nav className="topbar-nav">
                {NAV_LINKS.map(link => (
                    <Link
                        key={link.route}
                        to={link.route}
                        className={"topbar-nav-link" + (isActive(link) ? " active" : "")}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

        </div>

    );
}

export default TopBar;