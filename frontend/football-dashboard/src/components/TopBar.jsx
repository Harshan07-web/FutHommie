import { Link, useNavigate, useLocation } from "react-router-dom";

function TopBar() {

    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === "/";

    return (

        <div className="topbar">

            {!isHome && (
                <button
                    className="topbar-back"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            )}

            <Link
                to="/"
                className="topbar-brand"
            >
                Football Data Hub
            </Link>

        </div>

    );
}

export default TopBar;