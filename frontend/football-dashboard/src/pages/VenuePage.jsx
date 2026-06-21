import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/footballApi";

function VenuePage() {

    const { venueId, teamId } = useParams();

    const [venue, setVenue] = useState(null);
    const [team, setTeam] = useState(null);

    useEffect(() => {
        fetchVenue();
        fetchTeam();
    },[venueId, teamId]);

    async function fetchTeam() {

        try {

            const response = await api.get(
                `/fetch_team_details/${teamId}`
            );

            setTeam(response.data);

        }

        catch(error) {

            console.error(error);

        }
    }

    async function fetchVenue() {
        try{
            const response = await api.get(
                    `/fetch_venue_details/${venueId}`
            );

            setVenue(response.data);
        }
        catch(error){
            console.error(error);
        }
    }

    if (!venue || !team) {
        return <p className="state">Loading...</p>;
    }

    return(
        <div className="page">

            <img
                className="venue-photo"
                src={venue.image}
                alt={venue.name}
            />

            <div className="detail-header">

                <div className="badge badge-md">
                    <img
                        src={team.logo}
                        alt={team.team}
                    />
                </div>

                <h1>{venue.name}</h1>

            </div>

            <dl className="meta-list">

                <div className="meta-row">
                    <dt>Team</dt>
                    <dd>{team.team}</dd>
                </div>

                <div className="meta-row">
                    <dt>Address</dt>
                    <dd>{venue.address}</dd>
                </div>

                <div className="meta-row">
                    <dt>City</dt>
                    <dd>{venue.city}</dd>
                </div>

                <div className="meta-row">
                    <dt>Country</dt>
                    <dd>{venue.country}</dd>
                </div>

                <div className="meta-row">
                    <dt>Capacity</dt>
                    <dd>{venue.capacity}</dd>
                </div>

                <div className="meta-row">
                    <dt>Surface</dt>
                    <dd>{venue.surface}</dd>
                </div>

            </dl>

        </div>
    )
}

export default VenuePage;