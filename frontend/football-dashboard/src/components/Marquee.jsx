function Marquee({ items }) {

    if (!items || items.length === 0) return null;

    // duplicate the list so the CSS loop (translateX -50%) is seamless
    const track = [...items, ...items];

    return (

        <div className="marquee">

            <div className="marquee-track">

                {track.map((item, i) => (
                    <div key={`${item.name}-${i}`} className="marquee-item">
                        {item.logo && <img src={item.logo} alt={item.name} />}
                        <span>{item.name}</span>
                    </div>
                ))}

            </div>

        </div>

    );
}

export default Marquee;