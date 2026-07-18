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
                    {remaining.days > 0 && <span>{remaining.days}d</span>}
                    <span>{pad(remaining.hours)}h</span>
                    <span>{pad(remaining.minutes)}m</span>
                    <span>{pad(remaining.seconds)}s</span>
                </div>
            ) : (
                <div className="countdown-digits countdown-live">LIVE / FT</div>
            )}

        </div>

    );
}

export default Countdown;