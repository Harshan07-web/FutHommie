import { Link } from "react-router-dom";

function TopBar() {

    return (

        <div className="topbar">

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