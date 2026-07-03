import { useEffect, useState } from "react";
import api from "../api/footballApi";

// API-Football competitions (all seasons up to 2024)
const COMPETITIONS_APIFOOTBALL = [
    { id: 39,  name: "Premier League",               group: "England" },
    { id: 45,  name: "FA Cup",                       group: "England" },
    { id: 48,  name: "Carabao Cup",                  group: "England" },
    { id: 528, name: "Community Shield",              group: "England" },
    { id: 140, name: "La Liga",                       group: "Spain" },
    { id: 143, name: "Copa del Rey",                  group: "Spain" },
    { id: 556, name: "Spanish Super Cup",             group: "Spain" },
    { id: 78,  name: "Bundesliga",                    group: "Germany" },
    { id: 81,  name: "DFB Pokal",                     group: "Germany" },
    { id: 529, name: "DFL Super Cup",                 group: "Germany" },
    { id: 135, name: "Serie A",                       group: "Italy" },
    { id: 137, name: "Coppa Italia",                  group: "Italy" },
    { id: 547, name: "Supercoppa Italiana",           group: "Italy" },
    { id: 61,  name: "Ligue 1",                       group: "France" },
    { id: 66,  name: "Coupe de France",               group: "France" },
    { id: 526, name: "Trophée des Champions",         group: "France" },
    { id: 2,   name: "UEFA Champions League",         group: "Europe" },
    { id: 3,   name: "UEFA Europa League",            group: "Europe" },
    { id: 848, name: "UEFA Europa Conference League", group: "Europe" },
    { id: 531, name: "UEFA Super Cup",                group: "Europe" },
    { id: 15,  name: "FIFA Club World Cup",           group: "World" },
];

// DataORG competitions (2025+) — top 5 + UCL only
const COMPETITIONS_DATAORG = [
    { id: 2021, name: "Premier League",          group: "England" },
    { id: 2014, name: "La Liga",                  group: "Spain" },
    { id: 2002, name: "Bundesliga",               group: "Germany" },
    { id: 2019, name: "Serie A",                  group: "Italy" },
    { id: 2015, name: "Ligue 1",                  group: "France" },
    { id: 2001, name: "UEFA Champions League",    group: "Europe" },
];

// API-Football league ID → DataORG competition ID
const AF_TO_DO_COMP = {
    39:  2021,
    140: 2014,
    78:  2002,
    135: 2019,
    61:  2015,
    2:   2001,
};

const SEASONS_APIFOOTBALL = [2022, 2023, 2024];
const SEASONS_DATAORG     = [2025, 2026];
const ALL_SEASONS         = [...SEASONS_APIFOOTBALL, ...SEASONS_DATAORG];

function LeaderboardPage({ title, endpoint, statKey, statLabel, secondaryStats = [] }) {

    const [league,  setLeague]  = useState(39);
    const [season,  setSeason]  = useState(2024);
    const [players, setPlayers] = useState([]);
    const [teamMap, setTeamMap] = useState({});
    const [loading, setLoading] = useState(false);

    const isDataOrg = season >= 2025;

    const competitions = isDataOrg ? COMPETITIONS_DATAORG : COMPETITIONS_APIFOOTBALL;
    const groups       = [...new Set(competitions.map(c => c.group))];

    // When switching to DataOrg season, reset league to PL equivalent
    useEffect(() => {
        if (isDataOrg && !COMPETITIONS_DATAORG.find(c => c.id === league)) {
            setLeague(2021);
        } else if (!isDataOrg && !COMPETITIONS_APIFOOTBALL.find(c => c.id === league)) {
            setLeague(39);
        }
    }, [season]);

    useEffect(() => {
        if (!isDataOrg) buildTeamMap();
    }, [league, isDataOrg]);

    useEffect(() => {
        fetchLeaderboard();
    }, [league, season, endpoint]);

    async function buildTeamMap() {
        try {
            const res = await api.get(`/teams/${league}`);
            const map = {};
            for (const t of (res.data ?? [])) {
                map[t.team_id] = { name: t.team, logo: t.logo };
            }
            setTeamMap(map);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchLeaderboard() {

        try {

            setLoading(true);
            setPlayers([]);

            if (isDataOrg) {

                // For DataOrg seasons, league state holds DataOrg comp ID directly
                const compId = COMPETITIONS_DATAORG.find(c => c.id === league)
                    ? league
                    : AF_TO_DO_COMP[league] ?? 2021;

                const res = await api.get(`/dataorg/scorers/${compId}/${season}`);
                const raw = res.data ?? [];

                // normalise DataORG shape → same display shape
                const normalised = raw.map(p => ({
                    player_id:  p.player_id,
                    name:       p.player_name,
                    photo:      null,       // DataORG scorers have no photo
                    team_id:    p.team_id,
                    team_name:  p.team_name,
                    position:   p.position,
                    appearance: p.played_matches,
                    goals:      p.goals,
                    assists:    p.assists,
                    penalties:  p.penalties,
                    rating:     null,
                }));

                setPlayers(normalised);

            } else {

                const res = await api.get(`/fetch/${endpoint}/${league}/${season}`);
                const raw = res.data ?? [];

                // deduplicate — keep highest primary stat per player
                const seen = {};
                for (const p of raw) {
                    const existing = seen[p.player_id];
                    if (!existing || (p[statKey] ?? 0) > (existing[statKey] ?? 0)) {
                        seen[p.player_id] = p;
                    }
                }

                const sorted = Object.values(seen).sort(
                    (a, b) => (b[statKey] ?? 0) - (a[statKey] ?? 0)
                );

                setPlayers(sorted);
            }

        } catch (err) {

            console.error(err);
            setPlayers([]);

        } finally {

            setLoading(false);

        }
    }

    // For DataOrg, primary stat is always goals; secondary always assists
    const displayStatKey   = isDataOrg ? "goals"   : statKey;
    const displayStatLabel = isDataOrg ? "Goals"   : statLabel;
    const displaySecondary = isDataOrg
        ? [{ key: "assists", label: "Assists" }, { key: "penalties", label: "Penalties" }]
        : secondaryStats;

    const hasApps   = players[0]?.appearance != null;
    const hasRating = !isDataOrg;

    return (

        <div className="page">

            <div className="page-header">
                <span className="eyebrow">Players</span>
                <h1>{title}</h1>
            </div>

            <div className="controls">

                <select value={league} onChange={e => setLeague(Number(e.target.value))}>
                    {groups.map(group => (
                        <optgroup key={group} label={group}>
                            {competitions.filter(c => c.group === group).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>

                <select value={season} onChange={e => setSeason(Number(e.target.value))}>
                    {ALL_SEASONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

            </div>

            {loading ? (

                <p className="state">Loading {title.toLowerCase()}...</p>

            ) : players.length === 0 ? (

                <p className="state">No data found.</p>

            ) : (

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>#</th>
                                <th style={{ textAlign: "left" }}>Player</th>
                                <th style={{ textAlign: "left" }}>Team</th>
                                <th>Pos</th>
                                {hasApps   && <th>Apps</th>}
                                <th>{displayStatLabel}</th>
                                {displaySecondary.map(s => (
                                    <th key={s.key}>{s.label}</th>
                                ))}
                                {hasRating && <th>Rating</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((p, i) => {

                                const team = isDataOrg
                                    ? { name: p.team_name, logo: null }
                                    : teamMap[p.team_id];

                                return (
                                    <tr key={`${p.player_id}-${i}`}>

                                        <td className="num lb-rank">{i + 1}</td>

                                        <td>
                                            <div className="lb-player">
                                                {p.photo && (
                                                    <div className="badge badge-sm">
                                                        <img src={p.photo} alt={p.name} />
                                                    </div>
                                                )}
                                                <span className="lb-name">
                                                    {p.name ?? `Player #${p.player_id}`}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="lb-team">
                                                {team?.logo && (
                                                    <div className="badge badge-sm">
                                                        <img src={team.logo} alt={team.name} />
                                                    </div>
                                                )}
                                                <span>{team?.name ?? `Team #${p.team_id}`}</span>
                                            </div>
                                        </td>

                                        <td className="num">{p.position ?? "—"}</td>

                                        {hasApps && (
                                            <td className="num">{p.appearance ?? "—"}</td>
                                        )}

                                        <td className="lb-stat-primary num">
                                            {p[displayStatKey] ?? 0}
                                        </td>

                                        {displaySecondary.map(s => (
                                            <td key={s.key} className="num">
                                                {p[s.key] ?? 0}
                                            </td>
                                        ))}

                                        {hasRating && (
                                            <td className="num">
                                                {p.rating != null ? Number(p.rating).toFixed(1) : "—"}
                                            </td>
                                        )}

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            )}

        </div>

    );
}

export default LeaderboardPage;