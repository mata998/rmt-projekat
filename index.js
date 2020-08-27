const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const GameRoom = require("./serverclasses/GameRoom.js");
const User = require("./serverclasses/User.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log("Listening at 3000"));

// Midlewares
app.use(express.static("client"));
app.use(express.json());

// Rooms
const roomMap = new Map();
const freeRooms = ["room1", "room2", "room3"];

freeRooms.forEach((room) => {
  roomMap.set(room, new GameRoom(room));
});

function getAvailableRooms() {
  const availableRooms = [];

  roomMap.forEach((room, key) => {
    if (room.numOfPlayers < 2) {
      availableRooms.push(key);
    }
  });

  return availableRooms;
}

function updateEveryonesRooms() {
  const availableRooms = getAvailableRooms();

  io.sockets.emit("rooms", { availableRooms });
}

// Socket io
io.on("connection", (socket) => {
  // console.log("new socket connected");

  socket.on("rooms", () => {
    const availableRooms = getAvailableRooms();

    // send available rooms
    socket.emit("rooms", { availableRooms });
  });

  socket.on("create-room", ({ roomName }) => {
    if (roomMap.has(roomName)) {
      socket.emit("create-room", { type: "fail" });
    } else {
      const newRoom = new GameRoom(roomName);
      roomMap.set(roomName, newRoom);

      socket.emit("create-room", { type: "success", roomName });

      // Send available rooms to everyone
      updateEveryonesRooms();
    }
  });

  socket.on("join-room", ({ roomName }) => {
    const room = roomMap.get(roomName);

    if (room && room.numOfPlayers < 2) {
      const playerType = room.connect(socket);

      console.log(`Connection to room: ${roomName}, playerType: ${playerType}`);

      User.add(new User(socket, roomName, playerType));

      socket.emit("player-type", { type: playerType });

      // If the second player joined, room is not available anymore
      if (playerType === 1) {
        updateEveryonesRooms();
      }
    } else {
      console.log(`Room ${roomName} doesnt exist`);
      socket.emit("player-type", { type: -1 });
    }
  });

  socket.on("player-move", ({ roomName, move }) => {
    const room = roomMap.get(roomName);

    room.playerSockets[(move.player + 1) % 2].emit("player-move", {
      type: "success",
      move: move,
    });
  });

  // Client dissconected
  socket.on("disconnect", async () => {
    let deletedUser = User.delete(socket.id);

    // He didnt even exist
    if (!deletedUser) {
      return;
    }

    // Get users game room
    const room = roomMap.get(deletedUser.roomName);

    // Opponent
    const opponentSocket = room.playerSockets[(deletedUser.playerType + 1) % 2];

    // Check if opponent exists
    if (opponentSocket) {
      const opponent = User.getUser(opponentSocket.id);
      opponent.socket.emit("user-left");

      // kill the opponent
      User.delete(opponent.socket.id);
    }

    // kill the room
    if (freeRooms.includes(room.roomName)) {
      await setTimeout(() => {
        room.reset();

        // Update rooms for everyone
        updateEveryonesRooms();
      }, 10000);
    } else {
      roomMap.delete(room.roomName);
      updateEveryonesRooms();
    }

    // loggg
    console.log(
      `User left the room: ${deletedUser.roomName}, usertype: ${deletedUser.playerType}`
    );

    // console.log(User.getUsers());
  });
});
