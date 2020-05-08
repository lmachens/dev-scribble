import React, { useEffect, useState, useRef } from "react";
import GameStyles from "./game.module.css";
import Canvas from "../components/Canvas";
import SocketIO from "socket.io-client";
import { useParams } from "react-router-dom";

const Game = () => {
  const { gameId } = useParams();
  const socketRef = useRef(null);
  const [drawOperation, setDrawOperation] = useState(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
    socketRef.current = SocketIO("http://localhost:8080");
    socketRef.current.emit("join game", gameId);

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
  }, [gameId]);

  function handleCanvasChange(drawOperation) {
    socketRef.current.emit("draw operation", {
      ...drawOperation,
      gameId,
    });
  }
  if (!game) {
    return <div>Connecting...</div>;
  }

  return (
    <main className={GameStyles.main}>
      <div>Players: {game.players.length ?? 0}</div>
      <div>
        {game.players.map((player) => (
          <div key={player}>{player}</div>
        ))}
      </div>
      <Canvas
        onChange={handleCanvasChange}
        oldDrawOperations={game.drawOperations}
        drawOperation={drawOperation}
      />
    </main>
  );
};

export default Game;
