import { useNavigate } from "react-router-dom";

import "../styles/home.css";

function Home() {

    const navigate = useNavigate();

    const cards = [
        {
            title: "League Tables",
            route: "/standings"
        },
        {
            title: "Teams",
            route: "/teams"
        },
        {
            title: "Players",
            route: "/players"
        },
        {
            title: "Season Stats",
            route: "/season-stats"
        },
        {
            title: "Venues",
            route: "/venues"
        },
        {
            title: "Competitions",
            route: "/leagues"
        }
    ];

    return (

        <div className="home-container">

        <h1 className="home-title">
            Football Data Hub
        </h1>

        <p className="home-subtitle">
            Explore leagues, clubs, players and statistics from Europe's top competitions
        </p>

            <div className="card-grid">

                {cards.map((card) => (

                    <div
                        key={card.title}
                        className="dashboard-card"
                        onClick={() => navigate(card.route)}
                    >

                        <h2>
                            {card.title}
                        </h2>

                    </div>

                ))}

            </div>

        </div>

    );
}

export default Home;