// Global variables
const roomName = new URLSearchParams(window.location.search).get("roomName");
const board = document.querySelector(".board");
const mat = [[], [], [], [], [], [], [], []];

const WHITE_PLAYER = 0;
const BLACK_PLAYER = 1;

let playerType;
let playerColor;

let yourTurn = true;
let rememberYourTurn;

let highlightedMove;

// Show room name
document.getElementById("room-name").innerHTML = roomName;

// Socket connection
const socket = io();
socket.emit("join-room", { roomName });

socket.on("player-type", ({ type }) => {
  console.log(`Player type: ${type}`);
  playerType = type;
  playerColor = playerType == 0 ? "white" : "black";

  if (playerType === -1) {
    console.log("RESTART");
    location.href = "/";
  }

  createBoard();

  placeWhiteKing = mat[7][4];
  placeBotSmallSwitch = mat[7][6];
  placeBotBigSwitch = mat[7][2];

  placeBlackKing = mat[0][4];
  placeTopSmallSwitch = mat[0][6];
  placeTopBigSwitch = mat[0][2];
});

socket.on("game-state", ({ state, joinedFirst }) => {
  stateToBoard(state);

  if (state.turn === playerType) {
    changeInfoBox("green");
    yourTurn = true;
  } else {
    changeInfoBox("red");
    yourTurn = false;
  }

  if (joinedFirst) {
    changeInfoBox("blue");
    rememberYourTurn = yourTurn;
    yourTurn = false;
    return;
  }
});

socket.on("player-move", ({ move }) => {
  console.log("We got move!");

  if (move.special == "BotSmallSwitch") {
    doTopSmallSwitch();

    changeOpononentMoveHighlight(move);
  } else if (move.special == "BotBigSwitch") {
    doTopBigSwitch();

    changeOpononentMoveHighlight(move);
  } else {
    executeMove(OneMove.flip(move));

    changeOpononentMoveHighlight(OneMove.flip(move));
  }

  console.log("PLAY");

  changeInfoBox("green");
  yourTurn = true;
});

socket.on("user-joined", () => {
  yourTurn = rememberYourTurn;

  if (yourTurn) {
    changeInfoBox("green");
  } else {
    changeInfoBox("red");
  }
});

socket.on("user-left", () => {
  console.log("HE LEFT!");
  changeInfoBox("blue");
  rememberYourTurn = yourTurn;
  yourTurn = false;
});

function changeInfoBox(color) {
  const infoContainer = document.querySelector(".info-container");
  const textTurn = document.getElementById("moveText");

  if (color == "green") {
    infoContainer.style.backgroundColor = "rgb(160, 235, 160)";
    textTurn.innerHTML = "Your turn";
  }
  if (color == "red") {
    infoContainer.style.backgroundColor = "rgb(255, 80, 80)";
    textTurn.innerHTML = "Opponents turn";
  }
  if (color == "blue") {
    infoContainer.style.backgroundColor = "rgb(166, 166, 255)";
    textTurn.innerHTML = "Opponent not here :(";
  }
}

function createBoard() {
  let isBlack = playerType === 1 ? true : false;

  // Creating Field objects
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      mat[i][j] = new Field(i, j);

      if (isBlack) {
        mat[i][j].element.classList.add("black-field");
        isBlack = !isBlack;
      } else {
        isBlack = !isBlack;
      }

      board.appendChild(mat[i][j].element);
    }

    isBlack = !isBlack;
  }

  mat[0][0].element.style.borderTopLeftRadius = "6px";
  mat[0][7].element.style.borderTopRightRadius = "6px";
  mat[7][0].element.style.borderBottomLeftRadius = "6px";
  mat[7][7].element.style.borderBottomRightRadius = "6px";
}

function stateToBoard(state) {
  const matState = state.mat;

  if (playerType === WHITE_PLAYER) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (matState[i][j].isTaken) {
          mat[i][j].placePiece(matState[i][j].piece);
        }
      }
    }
  } else if (playerType === BLACK_PLAYER) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (matState[i][j].isTaken) {
          mat[7 - i][j].placePiece(matState[i][j].piece);
        }
      }
    }
  }
}

function highlightOpponentMove({ fromRow, fromCol, toRow, toCol, special }) {
  if (special == "BotSmallSwitch") {
    mat[0][4].opponentMoveHighlight();
    mat[0][6].opponentMoveHighlight();
  } else if (special == "BotBigSwitch") {
    mat[0][4].opponentMoveHighlight();
    mat[0][2].opponentMoveHighlight();
  } else {
    mat[fromRow][fromCol].opponentMoveHighlight();
    mat[toRow][toCol].opponentMoveHighlight();
  }
}

function removeOpponentHighlight() {
  if (highlightedMove) {
    const { fromRow, fromCol, toRow, toCol, special } = highlightedMove;

    if (special == "BotSmallSwitch") {
      mat[0][4].removeOpponentMoveHighlight();
      mat[0][6].removeOpponentMoveHighlight();
    } else if (special == "BotBigSwitch") {
      mat[0][4].removeOpponentMoveHighlight();
      mat[0][2].removeOpponentMoveHighlight();
    } else {
      mat[fromRow][fromCol].removeOpponentMoveHighlight();
      mat[toRow][toCol].removeOpponentMoveHighlight();
    }
  }
}

function changeOpononentMoveHighlight(newMove) {
  removeOpponentHighlight(highlightedMove);

  highlightedMove = newMove;

  highlightOpponentMove(highlightedMove);
}
