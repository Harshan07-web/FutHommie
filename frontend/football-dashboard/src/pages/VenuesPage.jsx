import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/footballApi";

function VenuesPage() {

    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchVenues();
    }, []);

    async function fetchVenues() {
        try {
            setLoading(true);
            const response = await api.get(
                "/fetch_all_venues"
            );
            setVenues(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <h1>Venues</h1>

            {loading ? (
                <p className="state">Loading...</p>
            ) : (
                <div className="grid" >
                    {venues.map((venue) => (
                        <div
                            key={venue.venue_id}
                            className="card"
                            onClick={() =>
                                navigate(
                                    `/venues/${venue.venue_id}/${venue.team_id}`
                                )
                            }
                        >
                            <div className="badge badge-lg">
                                <img
                                    src={venue.logo}
                                    alt={venue.name}
                                />
                            </div>
                            <h3>
                                {venue.name}
                            </h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VenuesPage;