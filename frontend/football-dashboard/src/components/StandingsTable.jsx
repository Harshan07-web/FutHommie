function StandingsTable({ standings }) {

    return (
        <table border="1">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Points</th>
                    <th>Wins</th>
                    <th>Draws</th>
                    <th>Losses</th>
                </tr>
            </thead>

            <tbody>
                {standings.map((team) => (
                    <tr key={team.team_id}>
                        <td>{team.rank}</td>
                        <td>{team.team}</td>
                        <td>{team.points}</td>
                        <td>{team.wins}</td>
                        <td>{team.draws}</td>
                        <td>{team.losses}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default StandingsTable;