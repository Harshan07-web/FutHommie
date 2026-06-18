import { Routes, Route } from "react-router-dom";

import Standings from "./pages/Standings";
import TeamPage from "./pages/TeamPage";

function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Standings />}
            />

            <Route
                path="/team/:teamId"
                element={<TeamPage />}
            />

        </Routes>

    );
}

export default App;