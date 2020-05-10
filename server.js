const express = require("express");
const http = require("http");
const path = require("path");
const { listenSocket } = require("./lib/socket");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

listenSocket(server);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
