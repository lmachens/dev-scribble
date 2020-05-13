const { secrets } = require("./secrets");

const games = {};
const players = {};

const TIME_PER_ROUND = 60;
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
    oldSecret: null,
    nextSecret: null,
    nextSecretLength: 0,
    secretHints: {},
    round: 0,
    correctGuessings: [],
    timeLeft: TIME_PER_ROUND,
    timeLeftIntervalId: null,
    redrawTimestamp: 0,
    distractPlayers: [],
    distractPossible: true,
  };
}

function leaveGame(gameId, playerId) {
  const game = games[gameId];
  if (!game) {
    return;
  }
  game.players = game.players.filter((player) => player.id !== playerId);

  if (gameIsEmpty(gameId)) {
    delete games[gameId];
  } else if (game.owner.id === playerId) {
    game.owner = game.players[0];
  }
}

function gameExists(gameId) {
  return Boolean(games[gameId]);
}

function getGame(gameId) {
  if (!games[gameId]) {
    return;
  }
  const { timeLeftIntervalId, ...game } = games[gameId];
  return game;
}

function getGameWithoutSecret(gameId) {
  if (!games[gameId]) {
    return;
  }
  const { nextSecret, timeLeftIntervalId, ...game } = games[gameId];
  return game;
}

function addDrawOperation(gameId, drawOperation) {
  if (!games[gameId]) {
    return;
  }
  games[gameId].drawOperations.push(drawOperation);
}

function clearCanvas({ gameId, playerId }) {
  if (!games[gameId]) {
    return;
  }
  games[gameId].drawOperations = [];
  games[gameId].redrawTimestamp = Date.now();
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
}

function gameIsEmpty(gameId) {
  return games[gameId].players.length === 0;
}

function getGames() {
  return Object.values(games).map((game) => ({
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

function guessWord({ gameId, guess, playerId }) {
  const game = getGame(gameId);
  if (game && game.nextSecret.toLowerCase() === guess.toLowerCase()) {
    game.correctGuessings.push(playerId);
    const player = game.players.find((player) => player.id === playerId);
    player.points = parseInt(player.points + game.timeLeft);
    return true;
  } else {
    return false;
  }
}

function newRound({
  gameId,
  onEndRound,
  onNewRound,
  onTimeLeft,
  onSecretHint,
}) {
  const game = games[gameId];
  if (!game) {
    return;
  }
  clearInterval(game.timeLeftIntervalId);

  game.oldSecret = game.nextSecret;
  let nextPlayerIndex = 0;
  if (game.nextPlayer) {
    game.nextPlayer.points = parseInt(
      game.nextPlayer.points +
        (game.correctGuessings.length / (game.players.length - 1)) *
          TIME_PER_ROUND
    );
    nextPlayerIndex =
      (game.players.findIndex((player) => player.id === game.nextPlayer.id) +
        1) %
      game.players.length;
  }

  onEndRound();
  const nextRoundDelay = game.nextPlayer ? 5000 : 0;

  game.nextPlayer = game.players[nextPlayerIndex];
  setTimeout(() => {
    game.timeLeft = TIME_PER_ROUND;
    game.oldSecret = null;
    game.secretHints = [];
    game.drawOperations = [];
    game.correctGuessings = [];
    game.round++;
    game.nextSecret = secrets[Math.floor(Math.random() * secrets.length)];
    game.nextSecretLength = game.nextSecret.length;
    onNewRound(game);

    game.timeLeftIntervalId = setInterval(() => {
      game.timeLeft--;
      onTimeLeft(game.timeLeft);

      if (game.timeLeft % 10 === 0 && game.timeLeft !== TIME_PER_ROUND) {
        const timeGone = 1 - game.timeLeft / TIME_PER_ROUND;
        const newHints = (timeGone - 0.35) * game.nextSecretLength;
        const existingHints = Object.keys(game.secretHints).length;
        const diff = newHints - existingHints;

        for (let count = 0; count < diff; count++) {
          let secretIndex = null;
          do {
            const index = Math.floor(Math.random() * game.nextSecret.length);
            if (!game.secretHints[index]) {
              secretIndex = index;
            }
          } while (secretIndex === null);

          const hint = game.nextSecret[secretIndex];

          game.secretHints[secretIndex] = hint;
        }
        if (diff > 0) {
          onSecretHint(game.secretHints);
        }
      }

      if (
        game.timeLeft <= 0 ||
        game.correctGuessings.length === game.players.length - 1
      ) {
        clearInterval(game.timeLeftIntervalId);
        newRound({ gameId, onEndRound, onNewRound, onTimeLeft, onSecretHint });
      }
    }, 1000);
  }, nextRoundDelay);
}

function startGame({
  gameId,
  ownerId,
  onEndRound,
  onNewRound,
  onTimeLeft,
  onSecretHint,
}) {
  const game = games[gameId];
  if (!game || game.owner.id !== ownerId) {
    return;
  }
  game.isRunning = true;
  newRound({ gameId, onEndRound, onNewRound, onTimeLeft, onSecretHint });
}

function distractPlayers({ gameId, playerId, onUpdate }) {
  const game = games[gameId];
  if (!game || !game.distractPossible) {
    return;
  }
  game.distractPossible = false;
  game.distractPlayers = game.players.filter(
    (player) => player.id !== playerId && player.id !== game.nextPlayer.id
  );

  setTimeout(() => {
    game.distractPlayers = [];
    onUpdate();

    setTimeout(() => {
      game.distractPossible = true;
      onUpdate();
    }, 22000);
  }, 8000);
}

exports.getGameWithoutSecret = getGameWithoutSecret;
exports.getGames = getGames;
exports.initializePlayer = initializePlayer;
exports.gameExists = gameExists;
exports.createGame = createGame;
exports.joinGame = joinGame;
exports.leaveGame = leaveGame;
exports.startGame = startGame;
exports.addDrawOperation = addDrawOperation;
exports.getPlayer = getPlayer;
exports.removePlayer = removePlayer;
exports.guessWord = guessWord;
exports.clearCanvas = clearCanvas;
exports.distractPlayers = distractPlayers;
