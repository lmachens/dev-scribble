import React, { useContext } from "react";
import usePersistantState from "../hooks/usePersistantState";

export const PlayerNameContext = React.createContext();

export function PlayerNameProvider({ children }) {
  const [playerName, setPlayerName] = usePersistantState("playerName", "");

  return (
    <PlayerNameContext.Provider value={[playerName, setPlayerName]}>
      {children}
    </PlayerNameContext.Provider>
  );
}

export function usePlayerName() {
  return useContext(PlayerNameContext);
}
