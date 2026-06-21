import { useNavigate } from "react-router-dom";

function StandingsTable({ standings }) {

    const navigate = useNavigate();

    return (
        <div className="table-wrap">

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
                        <td className="num">{team.rank}</td>
                        <td
                            onClick={() => {
                                navigate(`/team/${team.team_id}`);
                            }}
                        >

                            <div className="team-cell">
                                <div className="badge badge-sm">
                                    <img
                                        src={team.logo}
                                        alt={team.team}
                                    />
                                </div>

                                {team.team}
                            </div>
                        </td>

                        <td className="num">{team.played}</td>
                        <td className="num">{team.wins}</td>
                        <td className="num">{team.draws}</td>
                        <td className="num">{team.losses}</td>

                        <td className={
                            "num " + (team.goal_diff > 0
                                ? "gd-positive"
                                : team.goal_diff < 0
                                ? "gd-negative"
                                : "")
                        }>
                            {team.goal_diff > 0 ? `+${team.goal_diff}` : team.goal_diff}
                        </td>

                        <td className="num">{team.points}</td>

                    </tr>

                ))}

            </tbody>
        </table>
        </div>
    );
}

export default StandingsTable;