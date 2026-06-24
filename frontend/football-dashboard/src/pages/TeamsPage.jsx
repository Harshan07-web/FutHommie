import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/footballApi";

function TeamsPage() {

    const [teams, setTeams] = useState([]);
    const [league, setLeague] = useState(39);
    const [season, setSeason] = useState(2024);

    const navigate = useNavigate();

    const leagues = [
        { id: 39, name: "Premier League" },
        { id: 140, name: "La Liga" },
        { id: 78, name: "Bundesliga" },
        { id: 135, name: "Serie A" },
        { id: 61, name: "Ligue 1" }
    ];

    const seasons = [2024, 2023, 2022];

    useEffect(() => {
        fetchTeams();
    }, [league, season]);

    async function fetchTeams() {

        setTeams([]);

        try {

            const response = await api.get(
                `/fetch_teams/${league}/${season}`
            );

            setTeams(response.data);

        }

        catch (error) {

            console.error(error);

        }
    }

    return (

        <div className="page">

            <h1>Teams</h1>

            <div className="controls">

                <select
                    value={league}
                    onChange={(e) =>
                        setLeague(Number(e.target.value))
                    }
                >

                    {leagues.map((league) => (

                        <option
                            key={league.id}
                            value={league.id}
                        >
                            {league.name}
                        </option>

                    ))}

                </select>

                <select
                    value={season}
                    onChange={(e) =>
                        setSeason(Number(e.target.value))
                    }
                >

                    {seasons.map((s) => (

                        <option key={s} value={s}>
                            {s}/{s + 1}
                        </option>

                    ))}

                </select>

            </div>

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

        </div>

    );
}

export default TeamsPage;