import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/footballApi";
import "../styles/teams.css";

function LeaguePage() {

    const navigate = useNavigate();
    const { leagueId } = useParams();

    const [league, setLeague] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLeague();
        fetchTeams();
    }, [leagueId]);

    async function fetchLeague() {

        try {

            const response = await api.get(
                `/fetch_league/${leagueId}`
            );

            setLeague(response.data);

        }

        catch (error) {

            console.error(error);

        }
    }

    async function fetchTeams() {

        try {

            setLoading(true);

            const response = await api.get(
                `/teams/${leagueId}`
            );

            setTeams(response.data);

        }

        catch (error) {

            console.error(error);
            setTeams([]);

        }

        finally {

            setLoading(false);

        }
    }

    if (!league) {
        return <h1>Loading...</h1>;
    }

    return (

        <div className="page">

            <div className="header">

                <img
                    src={league.logo}
                    alt={league.league_name}
                    width="80"
                />

                <h1>{league.league_name}</h1>

            </div>

            <p>Type: {league.league_type}</p>

            <p>Country: {league.country}</p>

            <h2>Teams</h2>

            {loading ? (
                <h2>Loading...</h2>
            ) : teams.length === 0 ? (
                <h2>No teams found.</h2>
            ) : (

            <div className="team-grid">

                {teams.map((team) => (

                    <div
                        key={team.team_id}
                        className="team-card"
                        onClick={() =>
                            navigate(`/team/${team.team_id}`)
                        }
                    >

                        <img
                            src={team.logo}
                            alt={team.team}
                            width="80"
                        />

                        <h3>{team.team}</h3>

                    </div>

                ))}

            </div>

            )}

        </div>

    );
}

export default LeaguePage;