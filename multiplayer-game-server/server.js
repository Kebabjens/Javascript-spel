const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const gameState = {
  players: {},
  projectiles: [],
  monsters: [],
};

io.on("connection", (socket) => {
  const playerId = socket.id;
  gameState.players[playerId] = { x: 0, y: 0 };
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete gameState.players[playerId];
    io.emit("gameStateUpdate", gameState);
  });

  socket.on("playerMove", (data) => {
    gameState.players[playerId] = data;
    io.emit("gameStateUpdate", gameState);
    socket.broadcast.emit("playerMoved", data);
  });

  socket.on("playerShoot", (data) => {
    socket.broadcast.emit("playerShot", data);
  });
  // Handle game events here
});

setInterval(() => {
  io.emit("gameStateUpdate", gameState);
}, 1000 / 60); // 60 times per second

server.listen(3000, () => {
  console.log("listening on *:3000");
});
