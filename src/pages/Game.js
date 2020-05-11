import React, { useEffect, useState, useRef, useCallback } from "react";
import Canvas from "../components/Canvas";
import SocketIO from "socket.io-client";
import { useParams } from "react-router-dom";
import { usePlayerName } from "../contexts/playerName";
import SelectPlayerName from "../components/SelectPlayerName";
import Button, { ButtonLink } from "../components/Button";
import Players from "../components/Players";
import { pickColor } from "../utils/colors";
import GameActions from "../components/GameActions";
import PlayerStatus from "../components/PlayerStatus";

const Game = () => {
  const { gameId } = useParams();
  const socketRef = useRef(null);
  const [drawOperation, setDrawOperation] = useState(null);
  const [game, setGame] = useState(null);
  const [playerName] = usePlayerName();
  const [secret, setSecret] = useState("");
  const [guessings, setGuessings] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const round = game ? game.round : 1;
  useEffect(() => {
    setGuessings([]);
  }, [round, setGuessings]);

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

    function handleGuessWord({ guess, playerId }) {
      setGuessings((guessings) => [...guessings, { guess, playerId }]);
    }

    function handleTimeLeft(timeLeft) {
      setTimeLeft(timeLeft);
    }

    socketRef.current.on("draw operation", handleDrawOperation);
    socketRef.current.on("refresh game", handleRefreshGame);
    socketRef.current.on("get secret", handleGetSecret);
    socketRef.current.on("guess word", handleGuessWord);
    socketRef.current.on("time left", handleTimeLeft);

    return () => {
      socketRef.current.off(handleDrawOperation);
      socketRef.current.off(handleRefreshGame);
      socketRef.current.off(handleGetSecret);
      socketRef.current.off(handleGuessWord);
      socketRef.current.off(handleTimeLeft);
      socketRef.current.emit("leave game", gameId);
    };
  }, [playerName, gameId]);

  const handleCanvasChange = useCallback(
    (drawOperation) => {
      socketRef.current.emit("draw operation", {
        ...drawOperation,
        gameId,
      });
    },
    [gameId]
  );

  const handleStartGameClick = useCallback(() => {
    socketRef.current.emit("start game", gameId);
  }, [gameId]);

  const handleGuessSubmit = useCallback(
    (guess) => {
      socketRef.current.emit("guess word", {
        guess,
        gameId,
      });
    },
    [gameId]
  );

  const handleClear = useCallback(() => {
    socketRef.current.emit("clear canvas", gameId);
  }, [gameId]);

  if (!playerName) {
    return <SelectPlayerName />;
  }

  if (!game) {
    return <div>Connecting...</div>;
  }

  const playerId = socketRef.current.id;
  return (
    <div>
      <Players>
        {game.players.map((player) => (
          <PlayerStatus
            key={player.id}
            isNextPlayer={
              game.isRunning &&
              game.nextPlayer &&
              game.nextPlayer.id === player.id
            }
            correctAnswer={game.correctGuessings.includes(player.id)}
            guessings={guessings.filter(
              (guessing) => guessing.playerId === player.id
            )}
          >
            {player.name}({player.points})
          </PlayerStatus>
        ))}
      </Players>
      <GameActions
        game={game}
        isNextPlayer={game.isRunning && game.nextPlayer.id === playerId}
        secret={secret}
        onGuessSubmit={handleGuessSubmit}
        correctAnswer={game.correctGuessings.includes(playerId)}
        timeLeft={timeLeft}
        secretHints={game.secretHints}
      />
      <Canvas
        onChange={handleCanvasChange}
        oldDrawOperations={game.drawOperations}
        drawOperation={drawOperation}
        color={pickColor(playerName)}
        disabled={game.isRunning && game.nextPlayer.id !== playerId}
        nextPlayer={game.nextPlayer}
        onClear={handleClear}
        redrawTimestamp={game.redrawTimestamp}
      />
      <div>
        <Button
          onClick={handleStartGameClick}
          disabled={
            game.owner.id !== playerId ||
            game.isRunning ||
            game.players.length <= 1
          }
        >
          Start game
        </Button>
        <ButtonLink href="/games">Exit game</ButtonLink>
      </div>
    </div>
  );
};

export default Game;
