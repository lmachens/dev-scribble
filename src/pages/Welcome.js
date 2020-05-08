import React from "react";
import WelcomeStyles from "./welcome.module.css";
import usePersistantState from "../hooks/usePersistantState";
import robotFace from "../assets/robot_face.png";
import { useHistory } from "react-router-dom";

function Welcome() {
  const history = useHistory();
  const [playerName, setPlayerName] = usePersistantState("playerName", "");

  function handlePlayerNameChange(event) {
    const newPlayerName = event.target.value.trim();
    if (newPlayerName.length > 9) {
      return;
    }
    setPlayerName(newPlayerName);
  }

  function handleSubmit(event) {
    event.preventDefault();
    history.push("/games");
  }

  return (
    <main className={WelcomeStyles.main}>
      <form onSubmit={handleSubmit}>
        <img src={robotFace} alt="Surprised Robot Face" />
        <label>
          Who are you?
          <input
            value={playerName}
            onChange={handlePlayerNameChange}
            autoFocus
          />
        </label>
        <button disabled={playerName.length === 0}>Let me in</button>
      </form>
    </main>
  );
}

export default Welcome;
