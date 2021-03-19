const { findGame } = require("./db");

async function getGameById(req, res) {
  const { gameId } = req.params;
  const game = await findGame(gameId);
  if (!game) {
    return res.status(404).end();
  }
  res.json(game);
}

exports.getGameById = getGameById;
