import { useEffect, useState } from "react";
import api from "../api/footballApi";
import StandingsTable from "../components/StandingsTable";

function Standings() {

    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(false);

    const [league, setLeague] = useState(39);
    const [season, setSeason] = useState(2024);
    const [tableType, setTableType] = useState("overall");

    const leagues = [
        {
            id: 39,
            name: "Premier League",
            logo: "https://media.api-sports.io/football/leagues/39.png"
        },
        {
            id: 140,
            name: "La Liga",
            logo: "https://media.api-sports.io/football/leagues/140.png"
        },
        {
            id: 78,
            name: "Bundesliga",
            logo: "https://media.api-sports.io/football/leagues/78.png"
        },
        {
            id: 135,
            name: "Serie A",
            logo: "https://media.api-sports.io/football/leagues/135.png"
        },
        {
            id: 61,
            name: "Ligue 1",
            logo: "https://media.api-sports.io/football/leagues/61.png"
        }
    ];

    const seasons = [2022, 2023, 2024];

useEffect(() => {
    fetchStandings();
    }, [league, season, tableType]);

async function fetchStandings() {

    try {

        setLoading(true);

        let endpoint = "";

        if (tableType === "overall") {
            endpoint = `/standings/${season}/${league}`;
        }

        else if (tableType === "home") {
            endpoint = `/fetch_home_table/${season}/${league}`;
        }

        else if (tableType === "away") {
            endpoint = `/fetch_away_table/${season}/${league}`;
        }

        const response = await api.get(endpoint);

        setStandings(response.data);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }
}

    const selectedLeague =
        leagues.find(
            (l) => l.id === league
        );

    return (

        <div className="page">

            <div className="detail-header">

                <div className="badge badge-lg">
                    <img
                        src={selectedLeague.logo}
                        alt={selectedLeague.name}
                    />
                </div>

                <h1>
                    {selectedLeague.name}
                </h1>

            </div>

            <div className="controls">

                <select
                    value={league}
                    onChange={(e) =>
                        setLeague(
                            Number(e.target.value)
                        )
                    }
                >

                    {leagues.map((league) => (

                        <option
                            key={league.id}
                            value={league.id}
                        >
                            {league.name}
                        </option>

                    ))}

                </select>

                <select
                    value={season}
                    onChange={(e) =>
                        setSeason(
                            Number(e.target.value)
                        )
                    }
                >

                    {seasons.map((season) => (

                        <option
                            key={season}
                            value={season}
                        >
                            {season}
                        </option>

                    ))}

                </select>

                <div className="btn-group">

                    <button
                        className={tableType === "overall" ? "active" : ""}
                        onClick={() => setTableType("overall")}
                    >
                        Overall
                    </button>

                    <button
                        className={tableType === "home" ? "active" : ""}
                        onClick={() => setTableType("home")}
                    >
                        Home
                    </button>

                    <button
                        className={tableType === "away" ? "active" : ""}
                        onClick={() => setTableType("away")}
                    >
                        Away
                    </button>

                </div>

            </div>

            {loading ? (
                <p className="state">Loading...</p>
            ) : (
                <StandingsTable
                    standings={standings}
                />
            )}

        </div>

    );
}

export default Standings;