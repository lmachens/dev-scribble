import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./pages/Game";
import Welcome from "./pages/Welcome";
import Games from "./pages/Games";
import { PlayerNameProvider } from "./contexts/playerName";
import FullMain from "./components/FullMain";
import { SocketProvider } from "./contexts/socket";
import PastGame from "./pages/PastGame";

function App() {
  return (
    <Router>
      <SocketProvider>
        <PlayerNameProvider>
          <FullMain>
            <Switch>
              <Route path="/past-games/:gameId">
                <PastGame />
              </Route>
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
      </SocketProvider>
    </Router>
  );
}

export default App;
