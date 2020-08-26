const ul = document.getElementById("rooms-list");
const createBtn = document.querySelector(".btn");
const msg = document.getElementById("msg");

createBtn.addEventListener("click", createRoom);

(async () => {
  var response;
  var data;

  // Get all available rooms
  response = await fetch("/api/rooms");
  const rooms = await response.json();

  console.log(rooms);

  rooms.forEach((room) => {
    var newLi = document.createElement("li");
    newLi.innerHTML = room;
    newLi.addEventListener("click", connectToRoom);

    ul.appendChild(newLi);
  });
})();

async function connectToRoom(e) {
  var roomName = e.target.innerHTML;
  //   localStorage.setItem("roomName", roomName);

  location.href = `pages/game.html?roomName=${roomName}`;
}

async function createRoom() {
  const roomName = document.querySelector("input").value;

  if (roomName == "") {
    msg.innerHTML = "Enter room name";
    msg.style.color = "red";
    return;
  }

  // send new room name and get if its created or not
  const response = await fetch(`/api/createroom/${roomName}`);
  const data = await response.json();

  console.log(data);

  if (data.msg == "success") {
    // localStorage.setItem("roomName", roomName);

    location.href = `pages/game.html?roomName=${roomName}`;
  } else {
    msg.innerHTML = "That room exists";
    msg.style.color = "red";
  }
}
