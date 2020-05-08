import React, { useState, useRef, useEffect } from "react";
import GamesStyles from "./games.module.css";
import SocketIO from "socket.io-client";
import { usePlayerName } from "../contexts/playerName";
import SelectPlayerName from "../components/SelectPlayerName";
import PlayerName from "../components/PlayerName";

function Games() {
  const socketRef = useRef(null);
  const [games, setGames] = useState([]);
  const [playerName] = usePlayerName();

  useEffect(() => {
    if (!playerName) {
      return;
    }

    socketRef.current = SocketIO("http://localhost:8080");
    function handleListGames(games) {
      setGames(games);
    }

    socketRef.current.on("list games", handleListGames);
    socketRef.current.emit("list games");

    return () => {
      socketRef.current.off(handleListGames);
    };
  }, [playerName]);

  if (!playerName) {
    return <SelectPlayerName />;
  }

  return (
    <main className={GamesStyles.main}>
      Hello, <PlayerName>{playerName}</PlayerName>,<br />
      join or open a game.
      <h2>Open Games</h2>
      {games.length === 0 && <div>No games found</div>}
      {games.map((game) => (
        <a className={GamesStyles.joinGame} href={`/games/${game.gameId}`}>
          <div className={GamesStyles.game}>
            <div>
              {game.players.length} Players:{" "}
              {game.players.map((player) => (
                <PlayerName key={player.id}>{player.name}</PlayerName>
              ))}
            </div>
            <span className={GamesStyles.joinGameLabel}>Join Game</span>
          </div>
        </a>
      ))}
      <a className="button" href={`/games/${socketRef.current?.id}`}>
        Open Game
      </a>
    </main>
  );
}

export default Games;
