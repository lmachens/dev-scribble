import React, { useState } from "react";
import SelectPlayerNameStyles from "./selectPlayerName.module.css";
import robotFace from "../assets/robot_face.png";
import { usePlayerName } from "../contexts/playerName";

function SelectPlayerName({ onSubmit }) {
  const [playerName, setPlayerName] = usePlayerName();
  const [tempPlayerName, setTempPlayerName] = useState(playerName);

  function handlePlayerNameChange(event) {
    const newPlayerName = event.target.value.trim();
    if (newPlayerName.length > 9) {
      return;
    }
    setTempPlayerName(newPlayerName);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setPlayerName(tempPlayerName);
    if (onSubmit) {
      onSubmit(playerName);
    }
  }

  return (
    <main className={SelectPlayerNameStyles.main}>
      <form onSubmit={handleSubmit}>
        <img src={robotFace} alt="Surprised Robot Face" />
        <label>
          Who are you?
          <input
            value={tempPlayerName}
            onChange={handlePlayerNameChange}
            autoFocus
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <button disabled={tempPlayerName.length === 0}>Let me in</button>
      </form>
    </main>
  );
}

export default SelectPlayerName;
