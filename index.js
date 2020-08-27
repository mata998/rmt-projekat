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

  roomMap.forEach((room) => {
    if (room.numOfPlayers < 2 && room.visible) {
      availableRooms.push({
        roomName: room.roomName,
        numOfPlayers: room.numOfPlayers,
      });
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

      // Add user to list of current users
      User.add(new User(socket, roomName, playerType));

      // Send user his type
      socket.emit("player-type", { type: playerType });

      // Check if he joined first
      if (room.numOfPlayers === 1) {
        // Send user game state and that he joined first
        socket.emit("game-state", { state: room.gameState, joinedFirst: true });
      } else {
        // Send user game state
        socket.emit("game-state", {
          state: room.gameState,
          joinedFirst: false,
        });

        // inform his opponent that he joined
        room.playerSockets[(playerType + 1) % 2].emit("user-joined");
      }

      // If the second player joined, room is not available anymore
      // if (room.numOfPlayers === 2) {
      //   updateEveryonesRooms();
      // }
      updateEveryonesRooms();
    } else {
      console.log(`Room ${roomName} doesnt exist`);
      socket.emit("player-type", { type: -1 });
    }
  });

  socket.on("player-move", ({ roomName, move }) => {
    const room = roomMap.get(roomName);

    room.gameState.move(move);

    const opponentSocket = room.playerSockets[(move.player + 1) % 2];

    if (opponentSocket) {
      opponentSocket.emit("player-move", { move });
    }
  });

  // Client dissconected
  socket.on("disconnect", async () => {
    // Delete that user
    const deletedUser = User.delete(socket.id);

    // He didnt even exist
    if (!deletedUser) {
      return;
    }

    // Get users game room
    const room = roomMap.get(deletedUser.roomName);

    // Kick him from the room
    room.kickUser(deletedUser.socket.id);

    // Opponent
    const opponentSocket = room.playerSockets[(deletedUser.playerType + 1) % 2];

    // Check if opponent exists
    if (opponentSocket) {
      // if he exists, inform him
      opponentSocket.emit("user-left");
    } else {
      // kill the room
      if (freeRooms.includes(room.roomName)) {
        room.reset();
      } else {
        roomMap.delete(room.roomName);
      }
      // Inform everyone that one room is now available
      updateEveryonesRooms();
    }

    // loggg
    console.log(
      `User left the room: ${deletedUser.roomName}, usertype: ${deletedUser.playerType}`
    );

    // console.log(User.getUsers());
  });
});
