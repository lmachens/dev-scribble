import React, { useEffect, useState, useRef } from "react";
import GameStyles from "./game.module.css";
import Canvas from "../components/Canvas";
import SocketIO from "socket.io-client";
import { useParams } from "react-router-dom";
import { usePlayerName } from "../contexts/playerName";
import SelectPlayerName from "../components/SelectPlayerName";
import PlayerName from "../components/PlayerName";
import Button, { ButtonLink } from "../components/Button";
import Players from "../components/Players";
import { pickColor } from "../utils/colors";
import GuessInput from "../components/GuessInput";

const Game = () => {
  const { gameId } = useParams();
  const socketRef = useRef(null);
  const [drawOperation, setDrawOperation] = useState(null);
  const [game, setGame] = useState(null);
  const [playerName] = usePlayerName();
  const [secret, setSecret] = useState("");

  useEffect(() => {
    if (!playerName) {
      return;
    }

    socketRef.current = SocketIO();
    socketRef.current.emit("join game", { gameId, playerName });

    function handleDrawOperation(drawOperation) {
      setDrawOperation(drawOperation);
    }

    function handleRefreshGame(game) {
      setGame(game);
    }

    function handleGetSecret(secret) {
      setSecret(secret);
    }

    socketRef.current.on("draw operation", handleDrawOperation);
    socketRef.current.on("refresh game", handleRefreshGame);
    socketRef.current.on("get secret", handleGetSecret);

    return () => {
      socketRef.current.off(handleDrawOperation);
      socketRef.current.off(handleRefreshGame);
      socketRef.current.off(handleGetSecret);
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

  function handleSubmitGuess(guess) {
    socketRef.current.emit("guess word", {
      guess,
      gameId,
    });
  }

  if (!game) {
    return <div>Connecting...</div>;
  }

  const playerId = socketRef.current.id;
  return (
    <div>
      <Players>
        {game.players.map((player) => (
          <PlayerName key={player.id}>{player.name}</PlayerName>
        ))}
      </Players>
      <div className={GameStyles.status}>
        {game.isRunning ? (
          <span>
            {game.nextPlayer.id === playerId ? (
              secret
            ) : (
              <GuessInput
                onSubmit={handleSubmitGuess}
                secretLength={game.nextSecretLength}
                round={game.round}
              />
            )}
          </span>
        ) : (
          <span>
            Waiting for <PlayerName>{game.owner.name}</PlayerName> to start...
          </span>
        )}
      </div>
      <Canvas
        onChange={handleCanvasChange}
        oldDrawOperations={game.drawOperations}
        drawOperation={drawOperation}
        color={pickColor(playerName)}
        disabled={game.isRunning && game.nextPlayer.id !== playerId}
        nextPlayer={game.nextPlayer}
      />
      <div>
        <Button
          onClick={handleStartGameClick}
          disabled={game.owner.id !== playerId || game.isRunning}
        >
          Start game
        </Button>
        <ButtonLink href="/games">Exit game</ButtonLink>
      </div>
    </div>
  );
};

export default Game;
