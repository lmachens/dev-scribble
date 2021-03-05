const { MongoClient } = require("mongodb");

let database = null;

async function connect(uri) {
  const client = new MongoClient(uri);
  await client.connect();
  database = client.db();
}

async function getCategoriesCollection() {
  return database.collection("categories");
}

exports.connect = connect;
exports.getCategoriesCollection = getCategoriesCollection;
