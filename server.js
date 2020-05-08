const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = 8080;

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

const games = {};
const players = {};

function createGame(gameId) {
  games[gameId] = {
    players: [],
    drawOperations: [],
  };
}

function leaveGame(gameId, playerId) {
  games[gameId].players = games[gameId].players.filter(
    (player) => player !== playerId
  );
}

function gameExists(gameId) {
  return Boolean(games[gameId]);
}

function broadcastGameUpdate(gameId) {
  io.to(gameId).emit("refresh game", games[gameId]);
}

function broadcastDrawOperation(gameId, drawOperation) {
  io.to(gameId).emit("draw operation", drawOperation);
}

function addDrawOperation(gameId, drawOperation) {
  games[gameId].drawOperations.push(drawOperation);
}

function initializePlayer(playerId) {
  players[playerId] = {
    gameId: null,
  };
}

function joinGame(gameId, playerId) {
  players[playerId].gameId = gameId;
  games[gameId].players.push(playerId);
}

function getPlayer(playerId) {
  return players[playerId];
}

function removePlayer(playerId) {
  delete players[playerId];
}

io.on("connection", (socket) => {
  const playerId = socket.conn.id;
  initializePlayer(playerId);

  socket.on("join game", (gameId) => {
    if (!gameExists(gameId)) {
      createGame(gameId);
    }
    joinGame(gameId, playerId);

    socket.join(gameId);
    broadcastGameUpdate(gameId);
  });

  socket.on("leave game", (gameId) => {
    socket.leave(gameId);
    leaveGame(gameId, playerId);
    broadcastGameUpdate(gameId);
  });

  socket.on("draw operation", ({ gameId, ...drawOperation }) => {
    addDrawOperation(gameId, drawOperation);
    broadcastDrawOperation(gameId, drawOperation);
  });

  socket.on("disconnect", () => {
    const { gameId } = getPlayer(playerId);
    if (gameId) {
      leaveGame(gameId, playerId);
      broadcastGameUpdate(gameId);
    }
    removePlayer(playerId);
  });
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
