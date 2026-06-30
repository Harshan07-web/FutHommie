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
import ResultPage from "./pages/ResultPage";
import ResultsPage from "./pages/ResultsPage";
import LeaderboardPage from "./pages/LeaderBoardPage";
import WorldCupPage from "./pages/Worldcuppage";

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
                path="/venues"
                element={<VenuesPage />}
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

            <Route
                path="/results"
                element={<ResultsPage />}
            />

            <Route
                path="/results/:fixtureId"
                element={<ResultPage />}
            />

            <Route
                path="/fixtures"
                element={<FixturesPage />}
            />
            
            <Route
                path="/top-scorers"
                element={
                    <LeaderboardPage
                        title="Top Scorers"
                        endpoint="topscorers"
                        statKey="goals"
                        statLabel="Goals"
                        secondaryStats={[
                            { key: "assists", label: "Assists" },
                        ]}
                    />
                }
            />

            <Route
                path="/top-assists"
                element={
                    <LeaderboardPage
                        title="Top Assists"
                        endpoint="topassists"
                        statKey="assists"
                        statLabel="Assists"
                        secondaryStats={[
                            { key: "goals", label: "Goals" },
                        ]}
                    />
                }
            />

            <Route
                path="/top-yellow-cards"
                element={
                    <LeaderboardPage
                        title="Yellow Cards"
                        endpoint="topyellowcards"
                        statKey="yellow_cards"
                        statLabel="Yellows"
                        secondaryStats={[]}
                    />
                }
            />

            <Route
                path="/top-red-cards"
                element={
                    <LeaderboardPage
                        title="Red Cards"
                        endpoint="topredcards"
                        statKey="red_tot"
                        statLabel="Reds"
                        secondaryStats={[]}
                    />
                }
            />

            <Route
                path="/world-cup"
                element={<WorldCupPage />}
            />

        </Routes>

        </>

    );
}

export default App;