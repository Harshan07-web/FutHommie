import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/footballApi";

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
        return <p className="state">Loading...</p>;
    }

    return (

        <div className="page">

            <div className="detail-header">

                <div className="badge badge-lg">
                    <img
                        src={league.logo}
                        alt={league.league_name}
                    />
                </div>

                <h1>{league.league_name}</h1>

            </div>

            <dl className="meta-list">

                <div className="meta-row">
                    <dt>Type</dt>
                    <dd>{league.league_type}</dd>
                </div>

                <div className="meta-row">
                    <dt>Country</dt>
                    <dd>{league.country}</dd>
                </div>

            </dl>

            <h2>Teams</h2>

            {loading ? (
                <p className="state">Loading...</p>
            ) : teams.length === 0 ? (
                <p className="state">No teams found.</p>
            ) : (

            <div className="grid">

                {teams.map((team) => (

                    <div
                        key={team.team_id}
                        className="card"
                        onClick={() =>
                            navigate(`/team/${team.team_id}`)
                        }
                    >

                        <div className="badge badge-lg">
                            <img
                                src={team.logo}
                                alt={team.team}
                            />
                        </div>

                        <h3>{team.team}</h3>

                    </div>

                ))}

            </div>

            )}

        </div>

    );
}

export default LeaguePage;