import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/footballApi";
import "../styles/teams.css";

function LeaguesPage() {

    const navigate = useNavigate();

    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLeagues();
    }, []);

    async function fetchLeagues() {

        try {

            setLoading(true);

            const response = await api.get(
                `/fetch_leagues`
            );

            setLeagues(response.data);

        }

        catch (error) {

            console.error(error);
            setLeagues([]);

        }

        finally {

            setLoading(false);

        }
    }

    return (

        <div className="page">

            <h1>Competitions</h1>

            {loading ? (
                <h2>Loading...</h2>
            ) : leagues.length === 0 ? (
                <h2>No leagues found.</h2>
            ) : (

            <div className="team-grid">

                {leagues.map((league) => (

                    <div
                        key={league.league_id}
                        className="team-card"
                        onClick={() =>
                            navigate(`/league/${league.league_id}`)
                        }
                    >

                        <img
                            src={league.logo}
                            alt={league.league_name}
                            width="80"
                        />

                        <h3>{league.league_name}</h3>

                        <p>{league.country}</p>

                    </div>

                ))}

            </div>

            )}

        </div>

    );
}

export default LeaguesPage;