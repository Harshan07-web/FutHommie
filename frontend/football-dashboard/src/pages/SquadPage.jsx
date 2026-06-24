import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/footballApi";

function SquadPage() {

    const { teamId } = useParams();
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSquad();
    }, [teamId]);

    async function fetchSquad() {

        try {

            setLoading(true);

            const response = await api.get(
                `/fetch_squads/${teamId}`
            );

            setPlayers(response.data);

        }

        catch (error) {

            console.error(error);
            setPlayers([]);

        }

        finally {

            setLoading(false);

        }
    }

    return (

        <div className="page">

            <h1>Squad</h1>

            {loading ? (
                <p className="state">Loading...</p>
            ) : players.length === 0 ? (
                <p className="state">No squad data found.</p>
            ) : (

            <div className="grid">

                {players.map(player => (

                    <div
                        key={player.player_id}
                        className="card"
                        onClick={() =>
                            navigate(`/player/${player.player_id}`, {
                                state: {
                                    name:     player.name,
                                    team:     player.team,
                                    team_id:  player.team_id,
                                    number:   player.number,
                                    position: player.position,
                                    photo:    player.photo,
                                }
                            })
                        }
                    >

                        <div className="badge badge-lg">
                            <img
                                src={player.photo}
                                alt={player.name}
                            />
                        </div>

                        <h3>{player.name}</h3>

                        <p className="page-subtitle">{player.position}</p>

                        <p className="num">#{player.number} · {player.age} yrs</p>

                    </div>

                ))}

            </div>

            )}

        </div>
    );
}

export default SquadPage;