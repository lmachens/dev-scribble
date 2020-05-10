const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { secrets } = require("./secrets");
const path = require("path");

const PORT = process.env.PORT || 8080;

const games = {};
const players = {};

function createGame(gameId, playerId, playerName) {
  games[gameId] = {
    gameId,
    owner: {
      id: playerId,
      name: playerName,
    },
    players: [],
    drawOperations: [],
    isRunning: false,
    nextPlayer: null,
    nextSecret: null,
    nextSecretLength: 0,
    round: 0,
    correctGuessings: [],
  };
  broadcaseListGamesUpdate();
}

function leaveGame(gameId, playerId) {
  const game = games[gameId];
  if (!game) {
    return;
  }
  game.players = game.players.filter((player) => player.id !== playerId);

  if (gameIsEmpty(gameId)) {
    removeGame(gameId);
  } else if (game.owner.id === playerId) {
    game.owner = game.players[0];
  }

  broadcastGameUpdate(gameId);
  broadcaseListGamesUpdate();
}

function gameExists(gameId) {
  return Boolean(games[gameId]);
}

function getGame(gameId) {
  return games[gameId];
}

function getGameWithoutSecret(gameId) {
  if (!games[gameId]) {
    return;
  }
  const { nextSecret, ...game } = games[gameId];
  return game;
}

function broadcastGameUpdate(gameId) {
  io.to(gameId).emit("refresh game", getGameWithoutSecret(gameId));
}

function broadcaseListGamesUpdate() {
  io.emit("list games", getGames());
}

function broadcastGuessWord(gameId, guess, playerId) {
  io.to(gameId).emit("guess word", { guess, playerId });
}

function broadcastDrawOperation(gameId, drawOperation) {
  io.to(gameId).emit("draw operation", drawOperation);
}

function addDrawOperation(gameId, drawOperation) {
  if (!games[gameId]) {
    return;
  }
  games[gameId].drawOperations.push(drawOperation);
  broadcastDrawOperation(gameId, drawOperation);
}

function initializePlayer(playerId) {
  players[playerId] = {
    id: null,
    name: null,
    gameId: null,
  };
}

function joinGame(gameId, playerId, playerName) {
  players[playerId].gameId = gameId;
  if (games[gameId].players.find((player) => player.id === playerId)) {
    return;
  }
  games[gameId].players.push({
    id: playerId,
    name: playerName,
    points: 0,
  });
  broadcaseListGamesUpdate();
  broadcastGameUpdate(gameId);
}

function gameIsEmpty(gameId) {
  return games[gameId].players.length === 0;
}

function removeGame(gameId) {
  delete games[gameId];
  broadcaseListGamesUpdate();
}

function getGames() {
  return Object.values(games)
    .filter((game) => !game.isRunning)
    .map((game) => ({
      gameId: game.gameId,
      players: game.players,
    }));
}
function getPlayer(playerId) {
  return players[playerId];
}

function removePlayer(playerId) {
  delete players[playerId];
}

function newRound(gameId) {
  const game = getGame(gameId);
  game.nextPlayer =
    game.players[Math.floor(Math.random() * game.players.length)];
  game.drawOperations = [];
  game.nextSecret = secrets[Math.floor(Math.random() * secrets.length)];
  game.nextSecretLength = game.nextSecret.length;
  game.round++;

  io.to(game.nextPlayer.id).emit("get secret", game.nextSecret);

  broadcaseListGamesUpdate();
  broadcastGameUpdate(gameId);
}

function startGame(gameId, playerId) {
  const game = games[gameId];
  if (!game || game.owner.id !== playerId) {
    return;
  }
  game.isRunning = true;
  newRound(gameId);
}

io.on("connection", (socket) => {
  try {
    const playerId = socket.conn.id;
    initializePlayer(playerId);

    socket.on("list games", () => {
      socket.emit("list games", getGames());
    });

    socket.on("join game", ({ gameId, playerName }) => {
      if (!gameExists(gameId)) {
        createGame(gameId, playerId, playerName);
      }
      socket.join(gameId);
      joinGame(gameId, playerId, playerName);
    });

    socket.on("leave game", (gameId) => {
      socket.leave(gameId);
      leaveGame(gameId, playerId);
    });

    socket.on("start game", (gameId) => {
      startGame(gameId, playerId);
    });

    socket.on("draw operation", ({ gameId, ...drawOperation }) => {
      addDrawOperation(gameId, drawOperation);
    });

    socket.on("guess word", ({ gameId, guess }) => {
      const game = getGame(gameId);
      if (game.nextSecret.toLowerCase() === guess.toLowerCase()) {
        game.correctGuessings.push(playerId);
        const player = game.players.find((player) => player.id === playerId);
        player.points++;
        broadcastGameUpdate(gameId);

        if (game.correctGuessings.length === game.players.length - 1) {
          newRound(gameId);
        }
      } else {
        broadcastGuessWord(gameId, guess, playerId);
      }
    });

    socket.on("disconnect", () => {
      const { gameId } = getPlayer(playerId);
      if (gameId) {
        leaveGame(gameId, playerId);
      }
      removePlayer(playerId);
    });
  } catch (error) {
    console.error(error);
  }
});

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
