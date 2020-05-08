import React, { useEffect, useState, useRef } from "react";
import GameStyles from "./game.module.css";
import Canvas from "../components/Canvas";
import SocketIO from "socket.io-client";
import { useParams } from "react-router-dom";
import { usePlayerName } from "../contexts/playerName";
import SelectPlayerName from "../components/SelectPlayerName";
import PlayerName from "../components/PlayerName";

const Game = () => {
  const { gameId } = useParams();
  const socketRef = useRef(null);
  const [drawOperation, setDrawOperation] = useState(null);
  const [game, setGame] = useState(null);
  const [playerName] = usePlayerName();

  useEffect(() => {
    if (!playerName) {
      return;
    }

    socketRef.current = SocketIO("http://localhost:8080");
    socketRef.current.emit("join game", { gameId, playerName });

    function handleDrawOperation(drawOperation) {
      setDrawOperation(drawOperation);
    }

    function handleRefreshGame(game) {
      setGame(game);
    }

    socketRef.current.on("draw operation", handleDrawOperation);
    socketRef.current.on("refresh game", handleRefreshGame);

    return () => {
      socketRef.current.off(handleDrawOperation);
      socketRef.current.off(handleRefreshGame);
      socketRef.current.emit("leave game", gameId);
    };
  }, [playerName, gameId]);

  if (!playerName) {
    return <SelectPlayerName />;
  }

  function handleCanvasChange(drawOperation) {
    socketRef.current.emit("draw operation", {
      ...drawOperation,
      gameId,
    });
  }

  function handleStartGameClick() {
    socketRef.current.emit("start game", gameId);
  }

  if (!game) {
    return <div>Connecting...</div>;
  }

  return (
    <main className={GameStyles.main}>
      <div>{game.players.length ?? 0} Players</div>
      <div className={GameStyles.players}>
        {game.players.map((player) => (
          <PlayerName key={player.id}>{player.name}</PlayerName>
        ))}
      </div>
      <Canvas
        onChange={handleCanvasChange}
        oldDrawOperations={game.drawOperations}
        drawOperation={drawOperation}
      />
      <div>
        {game.ownerId === socketRef.current.id && (
          <button onClick={handleStartGameClick} disabled={game.isRunning}>
            Start game
          </button>
        )}
        <a className="button" href="/games">
          Exit game
        </a>
      </div>
    </main>
  );
};

export default Game;
