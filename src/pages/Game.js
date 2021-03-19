import React, { useEffect, useState, useCallback } from "react";
import Canvas from "../components/Canvas";
import { useHistory, useParams } from "react-router-dom";
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
import Select from "../components/Select";
import Distraction from "../components/Distraction";
import RoundSelect from "../components/RoundSelect";

const MaxWidthContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Border = styled.div`
  position: relative;
  border: 1px solid #2f363d;
  overflow: hidden;
  display: flex;
`;

const Game = () => {
  const history = useHistory();

  const { gameId } = useParams();
  const socket = useSocket();
  const [drawOperation, setDrawOperation] = useState(null);
  const [game, setGame] = useState(null);
  const [playerName] = usePlayerName();
  const [secret, setSecret] = useState("");
  const [guessings, setGuessings] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [oldDrawOperations, setOldDrawOperations] = useState(null);
  const [brushSize, setBrushSize] = useState("M");
  const [color, setColor] = useState(pickColor(playerName));
  const [categoryName, setCategoryName] = useState(null);
  const [categories, setCategories] = useState([]);
  const [maxRounds, setMaxRounds] = useState(3);

  const round = game ? game.round : 1;
  useEffect(() => {
    setGuessings([]);
  }, [round]);

  useEffect(() => {
    if (!playerName || !socket) {
      return;
    }

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

    function handleOldDrawOperations(oldDrawOperations) {
      setOldDrawOperations(oldDrawOperations);
    }

    function handleCategories(categories) {
      setCategories(categories);
      setCategoryName(categories[0].name);
    }

    function handleGameSettingsChange({ maxRounds, categoryName }) {
      setMaxRounds(maxRounds);
      setCategoryName(categoryName);
    }

    function handleEndGame() {
      history.push(`/past-games/${gameId}`);
    }

    socket.on("draw operation", handleDrawOperation);
    socket.on("refresh game", handleRefreshGame);
    socket.on("get secret", handleGetSecret);
    socket.on("guess word", handleGuessWord);
    socket.on("time left", handleTimeLeft);
    socket.on("old draw operations", handleOldDrawOperations);
    socket.on("categories", handleCategories);
    socket.on("game settings change", handleGameSettingsChange);
    socket.on("end game", handleEndGame);
    socket.emit("join game", {
      gameId,
      playerName,
    });

    return () => {
      socket.off(handleDrawOperation);
      socket.off(handleRefreshGame);
      socket.off(handleGetSecret);
      socket.off(handleGuessWord);
      socket.off(handleTimeLeft);
      socket.off(handleOldDrawOperations);
      socket.off(handleCategories);
      socket.off(handleGameSettingsChange);
      socket.off(handleEndGame);

      socket.emit("leave game", gameId);
    };
  }, [history, playerName, gameId, socket]);

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
    socket.emit("start game", { categoryName, maxRounds });
  }, [socket, categoryName, maxRounds]);

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
  const isNotEditable =
    game.owner.id !== playerId || game.isRunning || game.players.length <= 1;
  const showDistraction = Boolean(
    game.distractPlayers.find((player) => player.id === playerId)
  );

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
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          color={color}
          onColorChange={setColor}
        />
        <Border>
          <Canvas
            brushSize={brushSize}
            onChange={handleCanvasChange}
            oldDrawOperations={oldDrawOperations}
            drawOperation={drawOperation}
            color={color}
            disabled={game.nextPlayer && game.nextPlayer.id !== playerId}
            redrawTimestamp={game.redrawTimestamp}
          />
          {showDistraction && <Distraction />}
        </Border>
      </MaxWidthContainer>
      <div>
        <RoundSelect
          value={maxRounds}
          onChange={(event) =>
            socket.emit("game settings change", {
              maxRounds: +event.target.value,
              categoryName,
            })
          }
          disabled={isNotEditable}
        />
        <Select
          onChange={(event) =>
            socket.emit("game settings change", {
              maxRounds,
              categoryName: event.target.value,
            })
          }
          value={categoryName}
          disabled={isNotEditable}
        >
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>
        <Button onClick={handleStartGameClick} disabled={isNotEditable}>
          Start game
        </Button>
        <ButtonLink href="/games">Exit game</ButtonLink>
      </div>
    </div>
  );
};

export default Game;
