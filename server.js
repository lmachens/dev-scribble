const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = 8080;

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("draw operation", (drawOperation) => {
    socket.broadcast.emit("draw operation", drawOperation);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
