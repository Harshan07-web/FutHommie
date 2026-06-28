import { useEffect, useState } from "react";
import api from "../api/footballApi";

const COMPETITIONS = [
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

const GROUPS   = [...new Set(COMPETITIONS.map(c => c.group))];
const SEASONS  = [2022, 2023, 2024];

function LeaderboardPage({ title, endpoint, statKey, statLabel, secondaryStats = [] }) {

    const [league,  setLeague]  = useState(39);
    const [season,  setSeason]  = useState(2024);
    const [players, setPlayers] = useState([]);
    const [teamMap, setTeamMap] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        buildTeamMap();
    }, [league]);

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

            const res = await api.get(`/fetch/${endpoint}/${league}/${season}`);
            const raw = res.data ?? [];

            // deduplicate by player_id — keep highest primary stat per player
            const seen = {};
            for (const p of raw) {
                const existing = seen[p.player_id];
                if (!existing || (p[statKey] ?? 0) > (existing[statKey] ?? 0)) {
                    seen[p.player_id] = p;
                }
            }

            setPlayers(Object.values(seen));

        } catch (err) {

            console.error(err);
            setPlayers([]);

        } finally {

            setLoading(false);

        }
    }

    return (

        <div className="page">

            <div className="page-header">
                <span className="eyebrow">Players</span>
                <h1>{title}</h1>
            </div>

            <div className="controls">

                <select value={league} onChange={e => setLeague(Number(e.target.value))}>
                    {GROUPS.map(group => (
                        <optgroup key={group} label={group}>
                            {COMPETITIONS.filter(c => c.group === group).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>

                <select value={season} onChange={e => setSeason(Number(e.target.value))}>
                    {SEASONS.map(s => (
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
                                {players[0]?.appearance != null && <th>Apps</th>}
                                <th>{statLabel}</th>
                                {secondaryStats.map(s => (
                                    <th key={s.key}>{s.label}</th>
                                ))}
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((p, i) => {

                                const team = teamMap[p.team_id];

                                return (
                                    <tr key={`${p.player_id}-${i}`}>

                                        <td className="num lb-rank">{i + 1}</td>

                                        <td>
                                            <div className="lb-player">
                                                <div className="badge badge-sm">
                                                    {p.photo && (
                                                        <img src={p.photo} alt={p.name} />
                                                    )}
                                                </div>
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

                                        {players[0]?.appearance != null && (
                                            <td className="num">{p.appearance ?? "—"}</td>
                                        )}

                                        <td className="lb-stat-primary num">
                                            {p[statKey] ?? 0}
                                        </td>

                                        {secondaryStats.map(s => (
                                            <td key={s.key} className="num">
                                                {p[s.key] ?? 0}
                                            </td>
                                        ))}

                                        <td className="num">
                                            {p.rating != null ? Number(p.rating).toFixed(1) : "—"}
                                        </td>

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