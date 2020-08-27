const ul = document.getElementById("rooms-list");
const input = document.querySelector("input");
const createBtn = document.querySelector(".btn");
const msg = document.getElementById("msg");

createBtn.addEventListener("click", createRoom);
input.addEventListener("keyup", enterPressed);

const socket = io();

socket.emit("rooms", () => {});

socket.on("rooms", ({ availableRooms }) => {
  console.log(availableRooms);

  ul.innerHTML = "";

  availableRooms.forEach((room) => {
    const newLi = document.createElement("li");
    newLi.innerHTML = room;
    newLi.addEventListener("click", connectToRoom);

    ul.appendChild(newLi);
  });
});

function enterPressed(e) {
  if (e.keyCode === 13) {
    createRoom();
  }
}

function createRoom() {
  const roomName = input.value;

  if (roomName == "") {
    msg.innerHTML = "Enter room name";
    msg.style.color = "red";
    return;
  }

  socket.emit("create-room", { roomName });
}

socket.on("create-room", ({ type, roomName }) => {
  if (type == "success") {
    // localStorage.setItem("roomName", roomName);

    location.href = `pages/game.html?roomName=${roomName}`;
  } else {
    msg.innerHTML = "That room exists";
    msg.style.color = "red";
  }
});

async function connectToRoom(e) {
  var roomName = e.target.innerHTML;
  //   localStorage.setItem("roomName", roomName);

  location.href = `pages/game.html?roomName=${roomName}`;
}
