import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./pages/Game";
import Welcome from "./pages/Welcome";
import Games from "./pages/Games";
import { PlayerNameProvider } from "./contexts/playerName";
import FullMain from "./components/FullMain";

function App() {
  return (
    <Router>
      <PlayerNameProvider>
        <FullMain>
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
        </FullMain>
      </PlayerNameProvider>
    </Router>
  );
}

export default App;
