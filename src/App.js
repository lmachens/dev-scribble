import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./pages/Game";
import Welcome from "./pages/Welcome";
import Games from "./pages/Games";
import { PlayerNameProvider } from "./contexts/playerName";

function App() {
  return (
    <Router>
      <PlayerNameProvider>
        <Switch>
          <Route path="/games/:gameId">
            <Game />
          </Route>
          <Route path="/games">
            <Games />
          </Route>
          <Route path="/">
            <Welcome />
          </Route>
        </Switch>
      </PlayerNameProvider>
    </Router>
  );
}

export default App;
