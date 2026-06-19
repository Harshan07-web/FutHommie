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
    },[]);

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
        return <h1>Loading...</h1>;
    }
    
    return(
        <div>
            <img
                src={venue.image}
                alt={venue.name}
            />

            <img
                src={team.logo}
                alt={team.name}
            />

            <h1>{venue.name}</h1>
            <h1>{team.name}</h1>
            
            <p>Address : {venue.address}</p>

            <p>city : {venue.city} </p>

            <p>Country : {venue.country}</p>

            <p>Capacity: {venue.capacity}</p>

            <p>Surface : {venue.surface}</p>

        </div>
    )
}

export default VenuePage;