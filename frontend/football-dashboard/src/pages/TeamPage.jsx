import { useParams } from "react-router-dom";

function TeamPage() {

    const { teamId } = useParams();

    return (
        <div>
            <h1>Team ID: {teamId}</h1>
        </div>
    );
}

export default TeamPage;