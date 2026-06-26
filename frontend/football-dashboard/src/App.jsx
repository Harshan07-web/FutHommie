import { Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";

import Home from "./pages/Home";
import StandingsPage from "./pages/StandingsPage";
import HomeStandingsPage from "./pages/HomeStandingsPage";
import AwayStandingsPage from "./pages/AwayStandingsPage";
import TeamPage from "./pages/TeamPage";
import VenuePage from "./pages/VenuePage";
import VenuesPage from "./pages/VenuesPage";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import SquadPage from "./pages/SquadPage";
import LeaguesPage from "./pages/LeaguesPage";
import LeaguePage from "./pages/LeaguePage";
import PlayerPage from "./pages/PlayerPage";
import FixturesPage from "./pages/FixturesPage";
import FixturePage from "./pages/FixturePage";

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
                element={<StandingsPage />}
            />

            <Route
                path="/home-standings"
                element={<HomeStandingsPage />}
            />

            <Route
                path="/away-standings"
                element={<AwayStandingsPage />}
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
                path="/venues"
                element={<VenuesPage />}
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

            <Route
                path="/results"
                element={<FixturesPage />}
            />
 
            <Route
                path="/results/:fixtureId"
                element={<FixturePage />}
            />

        </Routes>

        </>

    );
}

export default App;