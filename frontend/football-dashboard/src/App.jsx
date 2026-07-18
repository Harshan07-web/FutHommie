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
import FixtureDetailPage from "./pages/FixtureDetailPage";
import ResultPage from "./pages/ResultPage";
import ResultsPage from "./pages/ResultsPage";
import LeaderboardPage from "./pages/LeaderBoardPage";
import WorldCupPage from "./pages/Worldcuppage";
import PlaceholderPage from "./pages/PlaceholderPage";

function App() {
    return (
        <div className="app-layout">
            <main className="main-content">
                <TopBar />

                <div className="page-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/standings" element={<StandingsPage />} />
                        <Route path="/home-standings" element={<HomeStandingsPage />} />
                        <Route path="/away-standings" element={<AwayStandingsPage />} />
                        <Route path="/team/:teamId" element={<TeamPage />} />
                        <Route path="/venues" element={<VenuesPage />} />
                        <Route path="/venues/:venueId/:teamId" element={<VenuePage />} />
                        <Route path="/teams" element={<TeamsPage />} />
                        <Route path="/players" element={<PlayersPage />} />
                        <Route path="/squad/:teamId" element={<SquadPage />} />
                        <Route path="/leagues" element={<LeaguesPage />} />
                        <Route path="/league/:leagueId" element={<LeaguePage />} />
                        <Route path="/player/:playerId" element={<PlayerPage />} />
                        <Route path="/results" element={<ResultsPage />} />
                        <Route path="/results/:fixtureId" element={<ResultPage />} />
                        <Route path="/fixtures" element={<FixturesPage />} />
                        <Route path="/fixtures/:fixtureId" element={<FixtureDetailPage />} />

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

                        <Route path="/world-cup" element={<WorldCupPage />} />

                        {/* Stubbed until real pages/endpoints exist */}
                        <Route path="/form-table" element={<PlaceholderPage title="Form Table" description="Clubs ranked by form across their last 5 matches — coming soon." />} />
                        <Route path="/team-stats" element={<PlaceholderPage title="Team Stats" description="Detailed performance metrics per club — coming soon." />} />
                        <Route path="/season-stats" element={<PlaceholderPage title="Season Stats" description="Aggregated team performance data — coming soon." />} />
                        <Route path="/injuries" element={<PlaceholderPage title="Injuries" description="Current and historical injury reports — coming soon." />} />
                        <Route path="/transfers" element={<PlaceholderPage title="Transfers" description="Player transfer activity by club and window — coming soon." />} />
                        <Route path="/live" element={<PlaceholderPage title="Live Scores" description="Live match data and in-game stats — coming soon." />} />
                        <Route path="/lineups" element={<PlaceholderPage title="Lineups" description="Starting XIs, formations and substitutes — coming soon." />} />
                        <Route path="/h2h" element={<PlaceholderPage title="Head to Head" description="Historical results between any two clubs — coming soon." />} />
                        <Route path="/clean-sheets" element={<PlaceholderPage title="Clean Sheets" description="Most clean sheets ranked by goalkeeper and club — coming soon." />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;