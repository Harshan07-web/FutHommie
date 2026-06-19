import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Standings from "./pages/Standings";
import TeamPage from "./pages/TeamPage";
import VenuePage from "./pages/VenuePage";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import SquadPage from "./pages/SquadPage";

function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/standings"
                element={<Standings />}
            />

            <Route
                path="/team/:teamId"
                element={<TeamPage />}
            />

            <Route
                path="/venues/:venueId/:teamId"
                element={<VenuePage />}
            />

            <Route
                path="/teams"
                element={<TeamsPage />}
            />

            <Route 
                path="/players" 
                element={<PlayersPage />} 
            
            />

            <Route
                path="/squad/:teamId"
                element={<SquadPage />}
            />

        </Routes>

    );
}

export default App;