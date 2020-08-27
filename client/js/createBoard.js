const roomName = new URLSearchParams(window.location.search).get("roomName");
let playerType;
let playerColor;
let yourTurn = true;
let rememberYourTurn;
const WHITE_PLAYER = 0;
const BLACK_PLAYER = 1;

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

socket.on("player-move", (data) => {
  if (data.type == "success") {
    console.log("We got move!");

    var receivedMove = data.move;
    console.log(receivedMove);

    if (sentMove == null || !OneMove.equals(receivedMove, sentMove)) {
      sentMove = receivedMove;

      if (receivedMove.special == "BotSmallSwitch") {
        doTopSmallSwitch();
      } else if (receivedMove.special == "BotBigSwitch") {
        doTopBigSwitch();
      } else {
        executeMove(OneMove.flip(receivedMove));
      }

      console.log("PLAY");

      changeInfoBox("green");
      yourTurn = true;
    } else {
      console.log("It's my last move");
    }
  } else {
    console.log("There was no move");
  }
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

var board = document.querySelector(".board");
var mat = [[], [], [], [], [], [], [], []];

var infoContainer = document.querySelector(".info-container");
var textRoomName = document.getElementById("room-name");
var textTurn = document.getElementById("moveText");

textRoomName.innerHTML = roomName;

function changeInfoBox(color) {
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

// Pieces
const blackPawn = new Piece("pawn-black", "black", "../imgs/black/pawn.png");
const blackBishop = new Piece("bishop", "black", "../imgs/black/bishop.png");
const blackKing = new Piece("king", "black", "../imgs/black/king.png");
const blackQueen = new Piece("queen", "black", "../imgs/black/queen.png");
const blackRook = new Piece("rook", "black", "../imgs/black/rook.png");
const blackKnight = new Piece("knight", "black", "../imgs/black/knight.png");

const whitePawn = new Piece("pawn-white", "white", "../imgs/white/pawn.png");
const whiteBishop = new Piece("bishop", "white", "../imgs/white/bishop.png");
const whiteKing = new Piece("king", "white", "../imgs/white/king.png");
const whiteQueen = new Piece("queen", "white", "../imgs/white/queen.png");
const whiteRook = new Piece("rook", "white", "../imgs/white/rook.png");
const whiteKnight = new Piece("knight", "white", "../imgs/white/knight.png");

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

/*
function createBoard() {
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

  // Piece setting

  let blackFigures = 0;
  let blackPawns = 1;

  let whitePawns = 6;
  let whiteFigures = 7;

  if (isBlack) {
    whiteFigures = 0;
    whitePawns = 1;

    blackPawns = 6;
    blackFigures = 7;
  }

  ////////// Blacks
  for (let j = 0; j < 8; j++) {
    mat[blackPawns][j].placePiece(blackPawn);
  }

  mat[blackFigures][0].placePiece(blackRook);
  mat[blackFigures][7].placePiece(blackRook);

  mat[blackFigures][1].placePiece(blackKnight);
  mat[blackFigures][6].placePiece(blackKnight);

  mat[blackFigures][2].placePiece(blackBishop);
  mat[blackFigures][5].placePiece(blackBishop);

  mat[blackFigures][3].placePiece(blackQueen);
  mat[blackFigures][4].placePiece(blackKing);

  ///////// Whites
  for (let j = 0; j < 8; j++) {
    mat[whitePawns][j].placePiece(whitePawn);
  }

  mat[whiteFigures][0].placePiece(whiteRook);
  mat[whiteFigures][7].placePiece(whiteRook);

  mat[whiteFigures][1].placePiece(whiteKnight);
  mat[whiteFigures][6].placePiece(whiteKnight);

  mat[whiteFigures][2].placePiece(whiteBishop);
  mat[whiteFigures][5].placePiece(whiteBishop);

  mat[whiteFigures][3].placePiece(whiteQueen);
  mat[whiteFigures][4].placePiece(whiteKing);
}

*/
