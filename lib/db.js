const { MongoClient } = require("mongodb");

let database = null;

async function connect(uri) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  database = client.db();
}

async function getCategoriesCollection() {
  return database.collection("categories");
}

async function getGamesCollection() {
  return database.collection("games");
}

async function findCategories() {
  const categoriesCollection = await getCategoriesCollection();
  return categoriesCollection.find().toArray();
}

async function insertGame(game) {
  const gamesCollection = await getGamesCollection();
  return gamesCollection.insertOne(game);
}

async function findGame(gameId) {
  const gamesCollection = await getGamesCollection();
  return gamesCollection.findOne({ gameId: gameId });
}

exports.connect = connect;
exports.getCategoriesCollection = getCategoriesCollection;
exports.getGamesCollection = getGamesCollection;
exports.findCategories = findCategories;
exports.insertGame = insertGame;
exports.findGame = findGame;
