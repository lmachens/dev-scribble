import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./pages/Game";
import Welcome from "./pages/Welcome";
import usePersistantState from "./hooks/usePersistantState";

function App() {
  const [playerName] = usePersistantState("playerName");

  return (
    <Router>
      <Switch>
        <Route path="/games/:gameId">
          <Game />
        </Route>
        <Route path="/">
          <Welcome />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
