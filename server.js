const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = 8080;

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

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
  };
  broadcaseListGamesUpdate();
}

function leaveGame(gameId, playerId) {
  const game = games[gameId];
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

function broadcastGameUpdate(gameId) {
  io.to(gameId).emit("refresh game", games[gameId]);
}

function broadcaseListGamesUpdate() {
  io.emit("list games", getGames());
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
  games[gameId].players.push({
    id: playerId,
    name: playerName,
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

function startGame(gameId, playerId) {
  const game = games[gameId];
  if (!game || game.owner.id !== playerId) {
    return;
  }
  game.isRunning = true;
  game.nextPlayer =
    game.players[Math.floor(Math.random() * game.players.length)];
  game.drawOperations = [];

  broadcaseListGamesUpdate();
  broadcastGameUpdate(gameId);
}

io.on("connection", (socket) => {
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

  socket.on("disconnect", () => {
    const { gameId } = getPlayer(playerId);
    if (gameId) {
      leaveGame(gameId, playerId);
    }
    removePlayer(playerId);
  });
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
