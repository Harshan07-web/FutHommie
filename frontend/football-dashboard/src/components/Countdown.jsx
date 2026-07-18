import { useEffect, useState } from "react";

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

// e.g. "Sun, 19 Jul, 2:30 AM IST"
function formatKickoffIST(targetISO) {
    if (!targetISO) return null;
    return `${IST_FORMATTER.format(new Date(targetISO))} IST`;
}

// home/away: { name, logo, tla } — pass null while the match hasn't been
// resolved from dataorg yet, teams render as "TBD".
function Countdown({ title, venue, home, away, targetISO }) {

    const [remaining, setRemaining] = useState(() => getRemaining(targetISO));

    useEffect(() => {
        const id = setInterval(() => setRemaining(getRemaining(targetISO)), 1000);
        return () => clearInterval(id);
    }, [targetISO]);

    return (

        <div className="countdown-row">

            <div className="countdown-title-row">
                <span className="countdown-label">{title}</span>
                {venue && <span className="countdown-subtitle">{venue}</span>}
            </div>

            {targetISO && (
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
                <span className="countdown-vs">vs</span>
                <div className="countdown-team">
                    <span>{away?.tla || away?.name || "TBD"}</span>
                    <div className="badge badge-sm">
                        {away?.logo && <img src={away.logo} alt={away?.tla || away?.name} />}
                    </div>
                </div>
            </div>

            {remaining ? (
                <div className="countdown-digits">
                    <span>{formatRemaining(remaining)}</span>
                </div>
            ) : (
                <div className="countdown-digits countdown-live">LIVE / FT</div>
            )}

        </div>

    );
}

export default Countdown;