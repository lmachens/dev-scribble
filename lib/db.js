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

async function findCategories() {
  const categoriesCollection = await getCategoriesCollection();
  return categoriesCollection.find().toArray();
}

exports.connect = connect;
exports.getCategoriesCollection = getCategoriesCollection;
exports.findCategories = findCategories;
