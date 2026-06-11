import { useEffect, useState } from "react";
import API from "../api/footballApi";
import StandingsTable from "../components/StandingsTable";

function Standings() {
    const [standings, setStandings] = useState([]);

    useEffect(() => {
        API.get("/standings/2024/39")
            .then((res) => {
                setStandings(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <h1>Standings</h1>

            <StandingsTable standings={standings} />
        </>
    );
}

export default Standings;