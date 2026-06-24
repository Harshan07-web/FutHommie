import { Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";

import Home from "./pages/Home";
import Standings from "./pages/Standings";
import TeamPage from "./pages/TeamPage";
import VenuePage from "./pages/VenuePage";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import SquadPage from "./pages/SquadPage";
import LeaguesPage from "./pages/LeaguesPage";
import LeaguePage from "./pages/LeaguePage";
import PlayerPage from "./pages/PlayerPage";

function App() {

    return (

        <>

        <TopBar />

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

            <Route
                path="/leagues"
                element={<LeaguesPage />}
            />

            <Route
                path="/league/:leagueId"
                element={<LeaguePage />}
            />

            <Route
                path="/player/:playerId"
                element={<PlayerPage />}
            />

        </Routes>

        </>

    );
}

export default App;