import React from "react";
import { useHistory } from "react-router-dom";
import SelectPlayerName from "../components/SelectPlayerName";

function Welcome() {
  const history = useHistory();

  function handleSubmit() {
    history.push("/games");
  }

  return <SelectPlayerName onSubmit={handleSubmit} />;
}

export default Welcome;
