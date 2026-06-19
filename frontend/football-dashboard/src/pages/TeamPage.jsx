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
    }, []);

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
        return <h1>Loading...</h1>;
    }

    return (
        <div>

            <img
                src={team.logo}
                alt={team.team}
                width="120"
            />

            <h1>{team.team}</h1>

            <p>Country: {team.country}</p>

            <p>Founded: {team.founded}</p>

            <p>Code: {team.code}</p>

            <p  onClick={() => {
                                console.log(team.venue_id);
                                navigate(`/venues/${team.venue_id}/${team.team_id}`);;
                            }}
                            style={{ cursor: "pointer" }}>
                                Venue ID: {team.venue_id}</p>

        </div>
    );
}

export default TeamPage;