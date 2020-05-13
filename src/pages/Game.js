import React, { useEffect, useState, useCallback } from "react";
import Canvas from "../components/Canvas";
import { useParams } from "react-router-dom";
import { usePlayerName } from "../contexts/playerName";
import SelectPlayerName from "../components/SelectPlayerName";
import Button, { ButtonLink } from "../components/Button";
import Players from "../components/Players";
import { pickColor } from "../utils/colors";
import GameStatus from "../components/GameStatus";
import PlayerStatus from "../components/PlayerStatus";
import { useSocket } from "../contexts/socket";
import GameActions from "../components/GameActions";
import styled from "@emotion/styled";

const MaxWidthContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Border = styled.div`
  border: 1px solid #2f363d;
  overflow: hidden;
`;

const Game = () => {
  const { gameId } = useParams();
  const socket = useSocket();
  const [drawOperation, setDrawOperation] = useState(null);
  const [game, setGame] = useState(null);
  const [playerName] = usePlayerName();
  const [secret, setSecret] = useState("");
  const [guessings, setGuessings] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const round = game ? game.round : 1;
  useEffect(() => {
    setGuessings([]);
  }, [round]);

  useEffect(() => {
    if (!playerName || !socket) {
      return;
    }

    socket.emit("join game", { gameId, playerName });

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

    socket.on("draw operation", handleDrawOperation);
    socket.on("refresh game", handleRefreshGame);
    socket.on("get secret", handleGetSecret);
    socket.on("guess word", handleGuessWord);
    socket.on("time left", handleTimeLeft);

    return () => {
      socket.off(handleDrawOperation);
      socket.off(handleRefreshGame);
      socket.off(handleGetSecret);
      socket.off(handleGuessWord);
      socket.off(handleTimeLeft);
      socket.emit("leave game", gameId);
    };
  }, [playerName, gameId, socket]);

  const handleCanvasChange = useCallback(
    (drawOperation) => {
      socket.emit("draw operation", {
        ...drawOperation,
        gameId,
      });
    },
    [gameId, socket]
  );

  const handleStartGameClick = useCallback(() => {
    socket.emit("start game", gameId);
  }, [gameId, socket]);

  const handleGuessSubmit = useCallback(
    (guess) => {
      socket.emit("guess word", {
        guess,
        gameId,
      });
    },
    [gameId, socket]
  );

  if (!playerName) {
    return <SelectPlayerName />;
  }

  if (!game) {
    return <div>Connecting...</div>;
  }

  const playerId = socket.id;
  return (
    <div>
      <Players>
        {game.players.map((player) => (
          <PlayerStatus
            key={player.id}
            isNextPlayer={game.nextPlayer && game.nextPlayer.id === player.id}
            correctAnswer={game.correctGuessings.includes(player.id)}
            guessings={guessings.filter(
              (guessing) => guessing.playerId === player.id
            )}
          >
            {player.name}({player.points})
          </PlayerStatus>
        ))}
      </Players>
      <GameStatus
        game={game}
        isNextPlayer={game.nextPlayer && game.nextPlayer.id === playerId}
        secret={secret}
        onGuessSubmit={handleGuessSubmit}
        correctAnswer={game.correctGuessings.includes(playerId)}
        timeLeft={timeLeft}
        secretHints={game.secretHints}
      />
      <MaxWidthContainer>
        <GameActions
          game={game}
          isDrawing={!game.nextPlayer || game.nextPlayer.id === playerId}
        />
        <Border>
          <Canvas
            onChange={handleCanvasChange}
            oldDrawOperations={game.drawOperations}
            drawOperation={drawOperation}
            color={pickColor(playerName)}
            disabled={game.nextPlayer && game.nextPlayer.id !== playerId}
            nextPlayer={game.nextPlayer}
            redrawTimestamp={game.redrawTimestamp}
            distraction={Boolean(
              game.distractPlayers.find((player) => player.id === playerId)
            )}
          />
        </Border>
      </MaxWidthContainer>
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
