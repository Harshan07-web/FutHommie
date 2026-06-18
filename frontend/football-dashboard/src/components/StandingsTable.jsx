import { useNavigate } from "react-router-dom";

function StandingsTable({ standings }) {

    const navigate = useNavigate();

    return (
        <table>

            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Played</th>
                    <th>Wins</th>
                    <th>Draws</th>
                    <th>Losses</th>
                    <th>GD</th>
                    <th>Points</th>
                </tr>
            </thead>

            <tbody>

                {standings.map((team) => (

                    <tr key={team.team_id}>

                        <td>{team.rank}</td>
                        
                        <td
                            onClick={() => {
                                console.log(team.team_id);
                                navigate(`/team/${team.team_id}`);
                            }}
                            style={{ cursor: "pointer" }}
                        >

                            <div className="team-cell">

                                <img
                                    src={team.logo}
                                    alt={team.team}
                                    className="team-logo"
                                />

                                {team.team}

                            </div>

                        </td>

                        <td>{team.played}</td>
                        <td>{team.wins}</td>
                        <td>{team.draws}</td>
                        <td>{team.losses}</td>
                        <td>{team.goal_diff}</td>
                        <td>{team.points}</td>

                    </tr>

                ))}

            </tbody>

        </table>
    );
}

export default StandingsTable;