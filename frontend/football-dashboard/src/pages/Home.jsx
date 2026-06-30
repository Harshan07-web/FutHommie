import { useNavigate } from "react-router-dom";

const sections = [
    {
        label: "World Cup",
        cards: [
            { title: "World Cup Hub", description: "Fixtures, results and top scorers — all in one place", route: "/world-cup" },
        ]
    },
    {
        label: "Standings",
        cards: [
            { title: "League Tables",  description: "Overall standings for all five top European leagues",       route: "/standings" },
            { title: "Home Form",      description: "League table ranked exclusively by home record",            route: "/home-standings" },
            { title: "Away Form",      description: "League table ranked exclusively by away record",            route: "/away-standings" },
            { title: "Form Table",     description: "Clubs ranked by form across their last 5 matches",          route: "/form-table" },
        ]
    },
    {
        label: "Clubs & Competitions",
        cards: [
            { title: "Teams",          description: "Browse every club by league and season",                    route: "/teams" },
            { title: "Team Stats",     description: "Detailed performance metrics per club",                     route: "/team-stats" },
            { title: "Season Stats",   description: "Aggregated team performance data across the season",        route: "/season-stats" },
            { title: "Leagues",        description: "All competitions and tournaments tracked in the database",  route: "/leagues" },
        ]
    },
    {
        label: "Players",
        cards: [
            { title: "Squads",         description: "Full squad rosters with player profiles and positions",     route: "/players" },
            { title: "Top Scorers",    description: "Golden boot rankings by player and club per league",        route: "/top-scorers" },
            { title: "Top Assists",    description: "Most assists — playmakers ranked across each league",       route: "/top-assists" },
            { title: "Yellow Cards",   description: "Disciplinary rankings — most bookings by league",          route: "/top-yellow-cards" },
            { title: "Red Cards",      description: "Most dismissals per player, club and league",               route: "/top-red-cards" },
            { title: "Injuries",       description: "Current and historical injury reports across all squads",   route: "/injuries" },
            { title: "Transfers",      description: "Player transfer activity by club and window",               route: "/transfers" },
        ]
    },
    {
        label: "Matches",
        cards: [
            { title: "Fixtures",       description: "Upcoming scheduled matches across all tracked leagues",     route: "/fixtures" },
            { title: "Results",        description: "Recent match results, final scores and goalscorers",        route: "/results" },
            { title: "Live Scores",    description: "Live match data and in-game stats updated in real time",    route: "/live" },
            { title: "Lineups",        description: "Starting XIs, formations and substitutes per fixture",      route: "/lineups" },
            { title: "Head to Head",   description: "Historical results between any two clubs",                  route: "/h2h" },
        ]
    },
    {
        label: "Venues & Intelligence",
        cards: [
            { title: "Stadiums",       description: "Stadium capacity, surface type and location data",          route: "/venues" },
            { title: "Clean Sheets",   description: "Most clean sheets ranked by goalkeeper and club",           route: "/clean-sheets" },
            { title: "Predictions",    description: "Match outcome predictions and win probabilities",            route: "/predictions" },
        ]
    },
];

function Home() {

    const navigate = useNavigate();

    return (

        <>

            <div className="home-hero">

                <div className="home-hero-inner">

                    <span className="eyebrow">FutHommie</span>

                    <h1>
                        Europe's top leagues,<br />
                        <span className="accent">all in one place.</span>
                    </h1>

                    <p>
                        Standings, squads, venues and player stats
                        across the Premier League, La Liga, Bundesliga,
                        Serie A and Ligue 1. 
                    </p>
                    <p>
                        2026 WORLD CUP IS LIVE !
                    </p>

                </div>

            </div>

            <div className="page">

                {sections.map((section) => (

                    <div key={section.label} className="home-section">

                        <div className="home-section-label">
                            <span>{section.label}</span>
                        </div>

                        <div className="nav-grid">

                            {section.cards.map((card) => (

                                <div
                                    key={card.title}
                                    className="nav-card"
                                    onClick={() => navigate(card.route)}
                                >

                                    <h3>{card.title}</h3>

                                    <p>{card.description}</p>

                                </div>

                            ))}

                        </div>

                    </div>

                ))}

            </div>

        </>

    );
}

export default Home;