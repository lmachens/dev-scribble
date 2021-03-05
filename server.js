const express = require("express");
const http = require("http");
const path = require("path");
const { connect } = require("./lib/db");
const { listenSocket } = require("./lib/socket");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/dev-scribble";
listenSocket(server);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

connect(MONGODB_URI).then(() => {
  console.log("DB connected");

  server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
  });
});
