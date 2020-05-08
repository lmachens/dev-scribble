import React from "react";
import PlayerNameStyles from "./playerName.module.css";

function PlayerName({ children }) {
  return <span className={PlayerNameStyles.playerName}>{children}</span>;
}

export default PlayerName;
