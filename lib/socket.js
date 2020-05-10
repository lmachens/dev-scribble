const SocketIO = require("socket.io");
const {
  getGameWithoutSecret,
  getGames,
  initializePlayer,
  gameExists,
  createGame,
  joinGame,
  leaveGame,
  startGame,
  addDrawOperation,
  guessWord,
  getPlayer,
  removePlayer,
  clearCanvas,
} = require("./games");

let io;

function broadcastGameUpdate(gameId) {
  io.to(gameId).emit("refresh game", getGameWithoutSecret(gameId));
}

function broadcastTimeLeft(gameId, timeLeft) {
  io.to(gameId).emit("time left", timeLeft);
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

function listenSocket(server) {
  io = SocketIO(server);
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
        broadcaseListGamesUpdate();
        broadcastGameUpdate(gameId);
      });

      socket.on("leave game", (gameId) => {
        socket.leave(gameId);
        leaveGame(gameId, playerId);
      });

      socket.on("start game", (gameId) => {
        startGame({
          gameId,
          ownerId: playerId,
          onNewRound: (game) => {
            io.to(game.nextPlayer.id).emit("get secret", game.nextSecret);
            broadcaseListGamesUpdate();
            broadcastGameUpdate(gameId);
          },
          onTimeLeft: (timeLeft) => {
            broadcastTimeLeft(gameId, timeLeft);
          },
          onSecretHint: () => {
            broadcastGameUpdate(gameId);
          },
        });
      });

      socket.on("draw operation", ({ gameId, ...drawOperation }) => {
        addDrawOperation(gameId, { ...drawOperation, playerId });
        broadcastDrawOperation(gameId, drawOperation);
      });

      socket.on("clear canvas", (gameId) => {
        clearCanvas({ gameId, playerId });
        broadcastGameUpdate(gameId);
      });

      socket.on("guess word", ({ gameId, guess }) => {
        const correctAnswer = guessWord({ gameId, guess, playerId });
        if (correctAnswer) {
          broadcastGameUpdate(gameId);
        } else {
          broadcastGuessWord(gameId, guess, playerId);
        }
      });

      socket.on("disconnect", () => {
        const { gameId } = getPlayer(playerId);
        removePlayer(playerId);
        if (gameId) {
          leaveGame(gameId, playerId);
          broadcastGameUpdate(gameId);
          broadcaseListGamesUpdate();
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
}

exports.listenSocket = listenSocket;
