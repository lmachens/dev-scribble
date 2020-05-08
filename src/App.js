import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/games/:gameId">
          <Game />
        </Route>
        <Route path="/"></Route>
      </Switch>
    </Router>
  );
}

export default App;
