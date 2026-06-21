import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/footballApi";

function TeamsPage() {

    const [teams, setTeams] = useState([]);
    const [league, setLeague] = useState(39);

    const navigate = useNavigate();

    const leagues = [
        { id: 39, name: "Premier League" },
        { id: 140, name: "La Liga" },
        { id: 78, name: "Bundesliga" },
        { id: 135, name: "Serie A" },
        { id: 61, name: "Ligue 1" }
    ];

    useEffect(() => {
        fetchTeams();
    }, [league]);

    async function fetchTeams() {

        try {

            const response = await api.get(
                `/teams/${league}`
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