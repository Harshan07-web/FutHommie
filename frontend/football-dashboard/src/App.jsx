import Standings from "./pages/Standings";

function App() {
  return (
    
    <>
      <h1>Football Data Analytics</h1>
      <h3>Supported Leagues</h3>
      <ul>
        <li>Premire League</li>
        <li>La Liga</li>
        <li>Bundesliga</li>
        <li>Serie A</li>
        <li>League Un</li>
      </ul>
      <Standings />
    </>
  );
}

export default App;