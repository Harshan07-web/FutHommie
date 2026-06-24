import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/footballApi";

function PlayerPage() {

    const { playerId } = useParams();
    const { state } = useLocation();   // { name, team, team_id, number, position, photo } from SquadPage
    const navigate = useNavigate();

    const [player, setPlayer] = useState(null);

    useEffect(() => {
        fetchPlayer();
    }, [playerId]);

    async function fetchPlayer() {

        try {

            const response = await api.get(
                `/fetch_player/${playerId}`
            );

            setPlayer(response.data);

        }

        catch (error) {

            console.error(error);

        }
    }

    // squad data passed via navigate state — used as fallback while player loads
    const squad = state ?? {};

    const displayPhoto   = player?.photo   ?? squad.photo;
    const displayName    = player?.name    ?? squad.name;
    const displayPos     = player?.position ?? squad.position;

    if (!player && !squad.name) {
        return <p className="state">Loading...</p>;
    }

    return (

        <div className="page">

            <div className="player-hero">

                <div className="badge badge-xl">
                    <img
                        src={displayPhoto}
                        alt={displayName}
                    />
                </div>

                <div className="player-hero-info">

                    <p className="eyebrow">{displayPos}</p>

                    <h1>{displayName}</h1>

                    {squad.team && (

                        <p
                            className="player-team-link"
                            onClick={() =>
                                navigate(`/team/${squad.team_id}`)
                            }
                        >
                            {squad.team}
                            {squad.number ? ` · #${squad.number}` : ""}
                        </p>

                    )}

                </div>

            </div>

            {player ? (

                <dl className="meta-list">

                    <div className="meta-row">
                        <dt>First name</dt>
                        <dd>{player.firstname}</dd>
                    </div>

                    <div className="meta-row">
                        <dt>Last name</dt>
                        <dd>{player.lastname}</dd>
                    </div>

                    <div className="meta-row">
                        <dt>Age</dt>
                        <dd>{player.age}</dd>
                    </div>

                    <div className="meta-row">
                        <dt>Nationality</dt>
                        <dd>{player.nationality}</dd>
                    </div>

                    <div className="meta-row">
                        <dt>Height</dt>
                        <dd>{player.height ?? "—"}</dd>
                    </div>

                    <div className="meta-row">
                        <dt>Weight</dt>
                        <dd>{player.weight ?? "—"}</dd>
                    </div>

                    <div className="meta-row">
                        <dt>Position</dt>
                        <dd>{player.position}</dd>
                    </div>

                </dl>

            ) : (

                <p className="state">Loading player details...</p>

            )}

        </div>

    );
}

export default PlayerPage;