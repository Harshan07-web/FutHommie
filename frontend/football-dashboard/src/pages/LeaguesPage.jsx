import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/footballApi";

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
                <p className="state">Loading...</p>
            ) : leagues.length === 0 ? (
                <p className="state">No leagues found.</p>
            ) : (

            <div className="grid">

                {leagues.map((league) => (

                    <div
                        key={league.league_id}
                        className="card"
                        onClick={() =>
                            navigate(`/league/${league.league_id}`)
                        }
                    >

                        <div className="badge badge-lg">
                            <img
                                src={league.logo}
                                alt={league.league_name}
                            />
                        </div>

                        <h3>{league.league_name}</h3>

                        <p className="page-subtitle">{league.country}</p>

                    </div>

                ))}

            </div>

            )}

        </div>

    );
}

export default LeaguesPage;