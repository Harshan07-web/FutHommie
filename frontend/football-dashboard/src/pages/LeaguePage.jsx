import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/footballApi";

function LeaguePage() {

    const navigate = useNavigate();
    const { leagueId } = useParams();

    const [league, setLeague] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [season, setSeason] = useState(null);

    const seasons = [2022, 2023, 2024];

    useEffect(() => {
        fetchLeague();
        fetchTeams(null);
    }, [leagueId]);

    useEffect(() => {
        if (season !== null) {
            fetchTeams(season);
        }
    }, [season]);

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

    async function fetchTeams(selectedSeason) {

        try {

            setLoading(true);

            let response;

            if (selectedSeason) {
                response = await api.get(
                    `/fetch_teams/${leagueId}/${selectedSeason}`
                );
                setTeams(response.data);

            } else {
                response = await api.get(
                    `/teams/${leagueId}`
                );
                setTeams(response.data);
            }

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

                <div>

                    <h1>{league.league_name}</h1>

                    <p className="page-subtitle">{league.country} · {league.league_type}</p>

                </div>

            </div>

            <div className="controls">

                <select
                    value={season ?? ""}
                    onChange={(e) =>
                        setSeason(e.target.value ? Number(e.target.value) : null)
                    }
                >

                    <option value="">All seasons</option>

                    {seasons.map((s) => (

                        <option key={s} value={s}>
                            {s}
                        </option>

                    ))}

                </select>

            </div>

            <h2>Teams {season ? `· ${season}` : ""}</h2>

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