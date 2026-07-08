import { useEffect, useState } from "react";
import api from "../api/footballApi";
import StandingsTable from "../components/StandingsTable";

const LEAGUES = [
    { afId: 39,  doId: 2021, name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
    { afId: 140, doId: 2014, name: "La Liga",         logo: "https://media.api-sports.io/football/leagues/140.png" },
    { afId: 78,  doId: 2002, name: "Bundesliga",      logo: "https://media.api-sports.io/football/leagues/78.png" },
    { afId: 135, doId: 2019, name: "Serie A",         logo: "https://media.api-sports.io/football/leagues/135.png" },
    { afId: 61,  doId: 2015, name: "Ligue 1",         logo: "https://media.api-sports.io/football/leagues/61.png" },
];

const ALL_SEASONS = [2022, 2023, 2024, 2025, 2026];

function HomeStandingsPage() {

    const [standings, setStandings] = useState([]);
    const [loading, setLoading]     = useState(false);
    const [league, setLeague]       = useState(39);
    const [season, setSeason]       = useState(2025);

    const isDataOrg      = season >= 2025;
    const selectedLeague = LEAGUES.find(l => l.afId === league);

    useEffect(() => {
        fetchStandings();
    }, [league, season]);

    async function fetchStandings() {
        try {
            setLoading(true);
            const endpoint = isDataOrg
                ? `/dataorg/homestandings/${season}/${selectedLeague.doId}`
                : `/fetch_home_table/${season}/${league}`;
            const response = await api.get(endpoint);
            setStandings(response.data);
        } catch (error) {
            console.error(error);
            setStandings([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">

            <div className="detail-header">
                <div className="badge badge-lg">
                    <img src={selectedLeague.logo} alt={selectedLeague.name} />
                </div>
                <h1>{selectedLeague.name} Home Standings</h1>
            </div>

            <div className="controls">

                <select value={league} onChange={e => setLeague(Number(e.target.value))}>
                    {LEAGUES.map(l => (
                        <option key={l.afId} value={l.afId}>{l.name}</option>
                    ))}
                </select>

                <select value={season} onChange={e => setSeason(Number(e.target.value))}>
                    {ALL_SEASONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

            </div>

            {loading
                ? <p className="state">Loading...</p>
                : <StandingsTable standings={standings} />
            }

        </div>
    );
}

export default HomeStandingsPage;