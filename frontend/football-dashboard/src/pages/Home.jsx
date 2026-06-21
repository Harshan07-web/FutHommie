import { useNavigate } from "react-router-dom";

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

        <div className="page">

            <div className="hero">

                <h1>Football Data Hub</h1>

                <p>
                    Explore leagues, clubs, players and statistics from Europe's top competitions
                </p>

            </div>

            <div className="grid">

                {cards.map((card) => (

                    <div
                        key={card.title}
                        className="card"
                        onClick={() => navigate(card.route)}
                    >

                        <h3>{card.title}</h3>

                    </div>

                ))}

            </div>

        </div>

    );
}

export default Home;