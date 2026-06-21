import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/footballApi";

function TeamPage() {

    const navigate = useNavigate();
    const { teamId } = useParams();

    const [team, setTeam] = useState(null);

    useEffect(() => {
        fetchTeam();
    }, [teamId]);

    async function fetchTeam() {

        try {

            const response = await api.get(
                `/fetch_team_details/${teamId}`
            );

            setTeam(response.data);

        }

        catch (error) {

            console.error(error);
        }
    }

    if (!team) {
        return <p className="state">Loading...</p>;
    }

    return (
        <div className="page">

            <div className="detail-header">

                <div className="badge badge-lg">
                    <img
                        src={team.logo}
                        alt={team.team}
                    />
                </div>

                <h1>{team.team}</h1>

            </div>

            <dl className="meta-list">

                <div className="meta-row">
                    <dt>Country</dt>
                    <dd>{team.country}</dd>
                </div>

                <div className="meta-row">
                    <dt>Founded</dt>
                    <dd>{team.founded}</dd>
                </div>

                <div className="meta-row">
                    <dt>Code</dt>
                    <dd>{team.code}</dd>
                </div>

                <div
                    className="meta-row link"
                    onClick={() => {
                        navigate(`/venues/${team.venue_id}/${team.team_id}`);
                    }}
                >
                    <dt>Venue</dt>
                    <dd>View venue →</dd>
                </div>

            </dl>

        </div>
    );
}

export default TeamPage;