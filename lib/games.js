const { secrets } = require("./secrets");

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
    timeLeft: 30,
    timeLeftIntervalId: null,
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

function guessWord({ gameId, guess, playerId }) {
  const game = getGame(gameId);
  if (game.nextSecret.toLowerCase() === guess.toLowerCase()) {
    game.correctGuessings.push(playerId);
    const player = game.players.find((player) => player.id === playerId);
    player.points += game.timeLeft;

    return true;
  } else {
    return false;
  }
}

function newRound({ gameId, onNewRound, onTimeLeft }) {
  const game = games[gameId];
  if (!game) {
    return;
  }
  clearInterval(game.timeLeftIntervalId);

  let nextPlayerIndex = 0;
  if (game.nextPlayer) {
    game.nextPlayer.points += Number(
      (game.correctGuessings.length / (game.players.length - 1)) * 30
    );
    nextPlayerIndex =
      (game.players.findIndex((player) => player.id === game.nextPlayer.id) +
        1) %
      game.players.length;
  }

  game.nextPlayer = game.players[nextPlayerIndex];
  game.drawOperations = [];
  game.nextSecret = secrets[Math.floor(Math.random() * secrets.length)];
  game.nextSecretLength = game.nextSecret.length;
  game.correctGuessings = [];
  game.round++;
  game.timeLeft = 30;
  onNewRound(game);

  game.timeLeftIntervalId = setInterval(() => {
    game.timeLeft--;
    onTimeLeft(game.timeLeft);
    if (
      game.timeLeft <= 0 ||
      game.correctGuessings.length === game.players.length - 1
    ) {
      clearInterval(game.timeLeftIntervalId);
      newRound({ gameId, onNewRound, onTimeLeft });
    }
  }, 1000);
}

function startGame({ gameId, ownerId, onNewRound, onTimeLeft }) {
  const game = games[gameId];
  if (!game || game.owner.id !== ownerId) {
    return;
  }
  game.isRunning = true;
  newRound({ gameId, onNewRound, onTimeLeft });
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
