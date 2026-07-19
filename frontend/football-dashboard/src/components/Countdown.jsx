import { useEffect, useState } from "react";

function normalizeUTC(dateStr) {
    if (!dateStr) return dateStr;
    if (/Z$|[+-]\d{2}:\d{2}$/.test(dateStr)) return dateStr;
    return `${dateStr}Z`;
}

function getRemaining(targetISO) {
    if (!targetISO) return null;
    const diff = new Date(targetISO).getTime() - Date.now();
    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
}

function pad(n) {
    return String(n).padStart(2, "0");
}

// "5h 29m 32s" — days segment only shows up if > 0
function formatRemaining({ days, hours, minutes, seconds }) {
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    parts.push(`${pad(hours)}h`);
    parts.push(`${pad(minutes)}m`);
    parts.push(`${pad(seconds)}s`);
    return parts.join(" ");
}

const IST_FORMATTER = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
});

function formatKickoffIST(targetISO) {
    if (!targetISO) return null;
    return `${IST_FORMATTER.format(new Date(targetISO))} IST`;
}

function Countdown({ title, venue, home, away, match, fallbackISO }) {

    const finished = (match?.status ?? "").toUpperCase() === "FINISHED";
    const targetISO = normalizeUTC(match?.date) ?? fallbackISO;

    const [remaining, setRemaining] = useState(() => getRemaining(targetISO));

    useEffect(() => {
        if (finished) return;
        const id = setInterval(() => setRemaining(getRemaining(targetISO)), 1000);
        return () => clearInterval(id);
    }, [targetISO, finished]);

    return (

        <div className="countdown-row">

            <div className="countdown-title-row">
                <span className="countdown-label">{title}</span>
                {venue && <span className="countdown-subtitle">{venue}</span>}
            </div>

            {!finished && targetISO && (
                <div className="countdown-subtitle countdown-kickoff">
                    {formatKickoffIST(targetISO)}
                </div>
            )}

            <div className="countdown-match">
                <div className="countdown-team">
                    <div className="badge badge-sm">
                        {home?.logo && <img src={home.logo} alt={home?.tla || home?.name} />}
                    </div>
                    <span>{home?.tla || home?.name || "TBD"}</span>
                </div>

                <div className="countdown-center">
                    {finished ? (
                        <div className="countdown-score">
                            <span>{match.ft_home_goals}</span>
                            <span className="countdown-score-sep">—</span>
                            <span>{match.ft_away_goals}</span>
                        </div>
                    ) : (
                        <span className="countdown-vs">vs</span>
                    )}
                </div>

                <div className="countdown-team">
                    <span>{away?.tla || away?.name || "TBD"}</span>
                    <div className="badge badge-sm">
                        {away?.logo && <img src={away.logo} alt={away?.tla || away?.name} />}
                    </div>
                </div>
            </div>

            {finished ? (
                <>
                    <div className="countdown-digits countdown-ft">FT</div>
                    {match.duration === "EXTRA_TIME" && (
                        <div className="countdown-subtitle countdown-extra">
                            FT {match.rt_home_goals}-{match.rt_away_goals} • ET {match.et_home_goals}-{match.et_away_goals}
                        </div>
                    )}
                    {match.duration === "PENALTY_SHOOTOUT" && (
                        <div className="countdown-subtitle countdown-extra">
                            FT {match.rt_home_goals}-{match.rt_away_goals} • ET {match.et_home_goals}-{match.et_away_goals} • Pens {match.pen_home_goals}-{match.pen_away_goals}
                        </div>
                    )}
                </>
            ) : remaining ? (
                <div className="countdown-digits">
                    <span>{formatRemaining(remaining)}</span>
                </div>
            ) : (
                <div className="countdown-digits countdown-live">LIVE</div>
            )}

        </div>

    );
}

export default Countdown;