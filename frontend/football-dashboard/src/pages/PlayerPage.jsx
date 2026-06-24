import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/footballApi";

function PlayerPage() {

    const { playerId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // squad state passed from SquadPage — only used for team/number (not in PlayerInfo)
    const squad = state ?? {};

    useEffect(() => {
        fetchPlayer();
    }, [playerId]);

    async function fetchPlayer() {

        try {

            setLoading(true);
            setError(false);

            const response = await api.get(
                `/fetch_player/${playerId}`
            );

            setPlayer(response.data);

        } catch (err) {

            console.error(err);
            setError(true);

        } finally {

            setLoading(false);

        }
    }

    if (loading) {
        return <p className="state">Loading player...</p>;
    }

    if (error || !player) {
        return <p className="state">Player details not found.</p>;
    }

    return (

        <div className="page">

            <div className="player-hero">

                <div className="badge badge-xl">
                    <img
                        src={player.photo}
                        alt={player.name}
                    />
                </div>

                <div className="player-hero-info">

                    <p className="eyebrow">{player.position}</p>

                    <h1>{player.name}</h1>

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

            <dl className="meta-list">

                <div className="meta-row">
                    <dt>First name</dt>
                    <dd>{player.firstname ?? "—"}</dd>
                </div>

                <div className="meta-row">
                    <dt>Last name</dt>
                    <dd>{player.lastname ?? "—"}</dd>
                </div>

                <div className="meta-row">
                    <dt>Age</dt>
                    <dd>{player.age ?? "—"}</dd>
                </div>

                <div className="meta-row">
                    <dt>Nationality</dt>
                    <dd>{player.nationality ?? "—"}</dd>
                </div>

                <div className="meta-row">
                    <dt>Height</dt>
                    <dd>{player.height ?? "—"}</dd>
                </div>

                <div className="meta-row">
                    <dt>Weight</dt>
                    <dd>{player.weight ?? "—"}</dd>
                </div>

            </dl>

        </div>
    );
}

export default PlayerPage;