import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/footballApi";

function SquadPage() {

    const { teamId } = useParams();

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchSquad();
    }, []);

    async function fetchSquad() {

        const response = await api.get(
            `/fetch_squads/${teamId}`
        );

        setPlayers(response.data);
    }

    return (

        <div>

            <h1>Squad</h1>

            <div className="player-grid">

                {players.map(player => (

                    <div
                        key={player.player_id}
                        className="player-card"
                    >

                        <img
                            src={player.photo}
                            alt={player.name}
                        />

                        <h4>{player.name}</h4>

                        <p>{player.position}</p>

                        <p>#{player.number}</p>

                        <p>{player.age} yrs</p>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default SquadPage;