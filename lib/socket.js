const SocketIO = require("socket.io");
const { findCategories } = require("./db");
const {
  getGameWithoutSecret,
  distractPlayers,
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

function listenSocket(server) {
  io = SocketIO(server);
  io.on("connection", (socket) => {
    try {
      const playerId = socket.id;
      initializePlayer(playerId);

      socket.on("list games", () => {
        socket.emit("list games", getGames());
      });

      socket.on("join game", async ({ gameId, playerName }) => {
        if (!gameExists(gameId)) {
          createGame({
            gameId,
            playerId,
            playerName,
          });
        }

        socket.join(gameId);

        const game = joinGame(gameId, playerId, playerName);
        socket.emit("old draw operations", game.drawOperations);
        const categories = await findCategories();
        socket.emit("categories", categories);
        broadcaseListGamesUpdate();
        broadcastGameUpdate(gameId);
      });

      socket.on("leave game", (gameId) => {
        socket.leave(gameId);
        leaveGame(gameId, playerId);
      });

      socket.on("start game", ({ gameId, categoryName }) => {
        startGame({
          categoryName,
          gameId,
          ownerId: playerId,
          onEndRound: () => {
            broadcastGameUpdate(gameId);
          },
          onNewRound: (game) => {
            io.to(gameId).emit("get secret", null);
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
        io.to(gameId).emit("draw operation", drawOperation);
      });

      socket.on("clear canvas", (gameId) => {
        clearCanvas({ gameId });
        broadcastGameUpdate(gameId);
      });

      socket.on("distract others", (gameId) => {
        distractPlayers({
          gameId,
          playerId,
          onUpdate: () => {
            broadcastGameUpdate(gameId);
          },
        });
        broadcastGameUpdate(gameId);
      });

      socket.on("guess word", ({ gameId, guess }) => {
        const correctAnswer = guessWord({ gameId, guess, playerId });
        if (correctAnswer) {
          broadcastGameUpdate(gameId);
          io.to(playerId).emit("get secret", correctAnswer);
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
