// Variables
var focusField = null;
var clickedField = null;
var availableFields = [];

var sentMove = null;
var intervalId = null;

// remove room name
localStorage.removeItem("roomName");

// Event listeners
board.addEventListener("click", click);

// send move to server
async function sendMoveToServer() {
  sentMove = new OneMove(
    focusField.row,
    focusField.col,
    clickedField.row,
    clickedField.col,
    clickedField.piece,
    playerType
  );

  console.log("Sending move");

  socket.emit("player-move", { roomName, move: sentMove });

  console.log("Move sent");
}

// Click function
function click(e) {
  if (!yourTurn) {
    console.log("Not your turn!!!");
    return;
  }

  if (e.target.className == "board") {
    console.log("you clicked on board");
    return;
  }

  clickedField = getField(e.target);

  if (focusField == null) {
    if (clickedField.isTaken && clickedField.piece.color == playerColor) {
      focusField = clickedField;
      focusField.highlight();

      getAvailableFields();
    }
  } else if (clickedField == focusField) {
    focusField.removeHighlight();
    removeAvailableFields();
    focusField = null;
  } else if (
    clickedField.isTaken &&
    clickedField.piece.color == focusField.piece.color
  ) {
    // ovde je bilo samo return
    focusField.removeHighlight();
    removeAvailableFields();

    focusField = clickedField;
    focusField.highlight();
    getAvailableFields();

    return;
  } else if (doSwitches()) {
    console.log("Odradjena rokada");

    changeInfoBox("red");
    yourTurn = false;
  } else {
    if (availableFields.includes(clickedField)) {
      sendMoveToServer();
      move();

      changeInfoBox("red");
      yourTurn = false;
    }
  }
}

// move from focusField to clickedField
function move() {
  clickedField.placePiece(focusField.piece);
  focusField.removeHighlight();
  removeAvailableFields();
  focusField.removePiece();
  focusField = null;
}

// execute move from  OneMove object
function executeMove(oneMove) {
  focusField = mat[oneMove.fromRow][oneMove.fromCol];
  clickedField = mat[oneMove.toRow][oneMove.toCol];

  move();
}

// gets field object from element clicked which is  img or div
function getField(clickedElement) {
  if (clickedElement.tagName == "IMG") {
    clickedElement = clickedElement.parentElement;
  }

  var id = clickedElement.id;
  var row = id.charAt(0);
  var col = id.charAt(1);

  return mat[row][col];
}

function removeAvailableFields() {
  availableFields.forEach((field) => field.removeHighlight());
  availableFields = [];
}

function getAvailableFields() {
  if (focusField.piece.type == "rook") {
    rook();
  }
  if (focusField.piece.type == "king") {
    king();
  }
  if (focusField.piece.type == "queen") {
    queen();
  }
  if (focusField.piece.type == "bishop") {
    bishop();
  }
  if (focusField.piece.type == "knight") {
    knight();
  }
  if (focusField.piece.type.includes("pawn")) {
    pawnWhite();
  }
}

// Available fields

function pawnWhite() {
  var row = focusField.row;
  var col = focusField.col;

  if (
    row - 1 >= 0 &&
    col - 1 >= 0 &&
    mat[row - 1][col - 1].isTaken &&
    mat[row - 1][col - 1].piece.color != focusField.piece.color
  ) {
    mat[row - 1][col - 1].highlightRed();
    availableFields.push(mat[row - 1][col - 1]);
  }

  if (
    row - 1 >= 0 &&
    col + 1 <= 7 &&
    mat[row - 1][col + 1].isTaken &&
    mat[row - 1][col + 1].piece.color != focusField.piece.color
  ) {
    mat[row - 1][col + 1].highlightRed();
    availableFields.push(mat[row - 1][col + 1]);
  }

  if (row == 6) {
    if (!mat[row - 1][col].isTaken) {
      mat[row - 1][col].highlight();
      availableFields.push(mat[row - 1][col]);
    } else {
      return;
    }

    if (!mat[row - 2][col].isTaken) {
      mat[row - 2][col].highlight();
      availableFields.push(mat[row - 2][col]);
    }
  } else if (row - 1 >= 0) {
    if (!mat[row - 1][col].isTaken) {
      mat[row - 1][col].highlight();
      availableFields.push(mat[row - 1][col]);
    }
  }
}

function pawnBlack() {
  var row = focusField.row;
  var col = focusField.col;

  if (
    row + 1 <= 7 &&
    col - 1 >= 0 &&
    mat[row + 1][col - 1].isTaken &&
    mat[row + 1][col - 1].piece.color != focusField.piece.color
  ) {
    mat[row + 1][col - 1].highlightRed();
    availableFields.push(mat[row + 1][col - 1]);
  }

  if (
    row + 1 <= 7 &&
    col + 1 <= 7 &&
    mat[row + 1][col + 1].isTaken &&
    mat[row + 1][col + 1].piece.color != focusField.piece.color
  ) {
    mat[row + 1][col + 1].highlightRed();
    availableFields.push(mat[row + 1][col + 1]);
  }

  if (row == 1) {
    if (!mat[row + 1][col].isTaken) {
      mat[row + 1][col].highlight();
      availableFields.push(mat[row + 1][col]);
    } else {
      return;
    }

    if (!mat[row + 2][col].isTaken) {
      mat[row + 2][col].highlight();
      availableFields.push(mat[row + 2][col]);
    }
  } else if (row + 1 <= 7) {
    if (!mat[row + 1][col].isTaken) {
      mat[row + 1][col].highlight();
      availableFields.push(mat[row + 1][col]);
    }
  }
}

function knight() {
  var row = focusField.row;
  var col = focusField.col;

  if (row - 1 >= 0 && col - 2 >= 0) {
    if (!mat[row - 1][col - 2].isTaken) {
      mat[row - 1][col - 2].highlight();
      availableFields.push(mat[row - 1][col - 2]);
    } else if (mat[row - 1][col - 2].piece.color != focusField.piece.color) {
      mat[row - 1][col - 2].highlightRed();
      availableFields.push(mat[row - 1][col - 2]);
    }
  }

  if (row - 2 >= 0 && col - 1 >= 0) {
    if (!mat[row - 2][col - 1].isTaken) {
      mat[row - 2][col - 1].highlight();
      availableFields.push(mat[row - 2][col - 1]);
    } else if (mat[row - 2][col - 1].piece.color != focusField.piece.color) {
      mat[row - 2][col - 1].highlightRed();
      availableFields.push(mat[row - 2][col - 1]);
    }
  }

  if (row + 1 <= 7 && col + 2 <= 7) {
    if (!mat[row + 1][col + 2].isTaken) {
      mat[row + 1][col + 2].highlight();
      availableFields.push(mat[row + 1][col + 2]);
    } else if (mat[row + 1][col + 2].piece.color != focusField.piece.color) {
      mat[row + 1][col + 2].highlightRed();
      availableFields.push(mat[row + 1][col + 2]);
    }
  }

  if (row + 2 <= 7 && col + 1 <= 7) {
    if (!mat[row + 2][col + 1].isTaken) {
      mat[row + 2][col + 1].highlight();
      availableFields.push(mat[row + 2][col + 1]);
    } else if (mat[row + 2][col + 1].piece.color != focusField.piece.color) {
      mat[row + 2][col + 1].highlightRed();
      availableFields.push(mat[row + 2][col + 1]);
    }
  }

  if (row - 1 >= 0 && col + 2 <= 7) {
    if (!mat[row - 1][col + 2].isTaken) {
      mat[row - 1][col + 2].highlight();
      availableFields.push(mat[row - 1][col + 2]);
    } else if (mat[row - 1][col + 2].piece.color != focusField.piece.color) {
      mat[row - 1][col + 2].highlightRed();
      availableFields.push(mat[row - 1][col + 2]);
    }
  }

  if (row + 2 <= 7 && col - 1 >= 0) {
    if (!mat[row + 2][col - 1].isTaken) {
      mat[row + 2][col - 1].highlight();
      availableFields.push(mat[row + 2][col - 1]);
    } else if (mat[row + 2][col - 1].piece.color != focusField.piece.color) {
      mat[row + 2][col - 1].highlightRed();
      availableFields.push(mat[row + 2][col - 1]);
    }
  }

  if (row + 1 <= 7 && col - 2 >= 0) {
    if (!mat[row + 1][col - 2].isTaken) {
      mat[row + 1][col - 2].highlight();
      availableFields.push(mat[row + 1][col - 2]);
    } else if (mat[row + 1][col - 2].piece.color != focusField.piece.color) {
      mat[row + 1][col - 2].highlightRed();
      availableFields.push(mat[row + 1][col - 2]);
    }
  }

  if (row - 2 >= 0 && col + 1 <= 7) {
    if (!mat[row - 2][col + 1].isTaken) {
      mat[row - 2][col + 1].highlight();
      availableFields.push(mat[row - 2][col + 1]);
    } else if (mat[row - 2][col + 1].piece.color != focusField.piece.color) {
      mat[row - 2][col + 1].highlightRed();
      availableFields.push(mat[row - 2][col + 1]);
    }
  }
}

function bishop() {
  var row = focusField.row;
  var col = focusField.col;
  var x = 0;
  var colored = true;

  var upleft = true;
  var upright = true;
  var downleft = true;
  var downright = true;

  while (colored) {
    x++;
    colored = false;

    if (row - x >= 0 && col - x >= 0 && upleft) {
      if (!mat[row - x][col - x].isTaken) {
        mat[row - x][col - x].highlight();
        availableFields.push(mat[row - x][col - x]);
        colored = true;
      } else if (mat[row - x][col - x].piece.color != focusField.piece.color) {
        mat[row - x][col - x].highlightRed();
        availableFields.push(mat[row - x][col - x]);

        upleft = false;
      } else {
        upleft = false;
      }
    }

    if (row + x <= 7 && col + x <= 7 && downright) {
      if (!mat[row + x][col + x].isTaken) {
        mat[row + x][col + x].highlight();
        availableFields.push(mat[row + x][col + x]);
        colored = true;
      } else if (mat[row + x][col + x].piece.color != focusField.piece.color) {
        mat[row + x][col + x].highlightRed();
        availableFields.push(mat[row + x][col + x]);

        downright = false;
      } else {
        downright = false;
      }
    }

    if (row + x <= 7 && col - x >= 0 && downleft) {
      if (!mat[row + x][col - x].isTaken) {
        mat[row + x][col - x].highlight();
        availableFields.push(mat[row + x][col - x]);
        colored = true;
      } else if (mat[row + x][col - x].piece.color != focusField.piece.color) {
        mat[row + x][col - x].highlightRed();
        availableFields.push(mat[row + x][col - x]);

        downleft = false;
      } else {
        downleft = false;
      }
    }

    if (row - x >= 0 && col + x <= 7 && upright) {
      if (!mat[row - x][col + x].isTaken) {
        mat[row - x][col + x].highlight();
        availableFields.push(mat[row - x][col + x]);
        colored = true;
      } else if (mat[row - x][col + x].piece.color != focusField.piece.color) {
        mat[row - x][col + x].highlightRed();
        availableFields.push(mat[row - x][col + x]);

        upright = false;
      } else {
        upright = false;
      }
    }
  }
}

function rook() {
  var row = focusField.row;
  var col = focusField.col;
  var x = 0;
  var colored = true;

  var up = true;
  var down = true;
  var left = true;
  var right = true;

  while (colored) {
    colored = false;
    x++;

    if (col + x <= 7 && right) {
      if (!mat[row][col + x].isTaken) {
        mat[row][col + x].highlight();
        availableFields.push(mat[row][col + x]);
        colored = true;
      } else if (mat[row][col + x].piece.color != focusField.piece.color) {
        mat[row][col + x].highlightRed();
        availableFields.push(mat[row][col + x]);
        colored = true;

        right = false;
      } else {
        right = false;
      }
    }

    if (col - x >= 0 && left) {
      if (!mat[row][col - x].isTaken) {
        mat[row][col - x].highlight();
        availableFields.push(mat[row][col - x]);
        colored = true;
      } else if (mat[row][col - x].piece.color != focusField.piece.color) {
        mat[row][col - x].highlightRed();
        availableFields.push(mat[row][col - x]);
        colored = true;

        left = false;
      } else {
        left = false;
      }
    }

    if (row + x <= 7 && down) {
      if (!mat[row + x][col].isTaken) {
        mat[row + x][col].highlight();
        availableFields.push(mat[row + x][col]);
        colored = true;
      } else if (mat[row + x][col].piece.color != focusField.piece.color) {
        mat[row + x][col].highlightRed();
        availableFields.push(mat[row + x][col]);
        colored = true;

        down = false;
      } else {
        down = false;
      }
    }

    if (row - x >= 0 && up) {
      if (!mat[row - x][col].isTaken) {
        mat[row - x][col].highlight();
        availableFields.push(mat[row - x][col]);
        colored = true;
      } else if (mat[row - x][col].piece.color != focusField.piece.color) {
        mat[row - x][col].highlightRed();
        availableFields.push(mat[row - x][col]);
        colored = true;

        up = false;
      } else {
        up = false;
      }
    }
  }
}

function queen() {
  bishop();
  rook();
}

function king() {
  var row = focusField.row;
  var col = focusField.col;

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && j >= 0 && i <= 7 && j <= 7) {
        if (!mat[i][j].isTaken) {
          mat[i][j].highlight();
          availableFields.push(mat[i][j]);
        } else if (mat[i][j].piece.color != focusField.piece.color) {
          mat[i][j].highlightRed();
          availableFields.push(mat[i][j]);
        }
      }
    }
  }

  // MALA ROKADA BELI KRALJ
  if (possibleBotSmallSwitch()) {
    mat[7][6].highlight();
    availableFields.push(mat[7][6]);
  }

  // VELIKA ROKADA BELI KRALJ
  if (possibleBotBigSwitch()) {
    mat[7][2].highlight();
    availableFields.push(mat[7][2]);
  }

  // // MALA ROKADA CRNI KRALJ
  // if (mozeMalaRokadaCrna()){
  //     mat[0][6].highlight();
  //     availableFields.push(mat[0][6]);
  // }

  // // VELIKA ROKADA CRNI KRALJ
  // if (mozeVelikaRokadaCrna()){
  //     mat[0][2].highlight();
  //     availableFields.push(mat[0][2]);
  // }
}

// SWITCHES

let placeWhiteKing;
let placeBotSmallSwitch;
let placeBotBigSwitch;

let placeBlackKing;
let placeTopSmallSwitch;
let placeTopBigSwitch;

function doSwitches() {
  if (
    possibleBotSmallSwitch() &&
    focusField == placeWhiteKing &&
    clickedField == placeBotSmallSwitch
  ) {
    doBotSmallSwitch();
    sendBotSmallSwitch();
    return true;
  } else if (
    possibleBotBigSwitch() &&
    focusField == placeWhiteKing &&
    clickedField == placeBotBigSwitch
  ) {
    doBotBigSwitch();
    sendBotBigSwitch();
    return true;
  }

  return false;
}

// BOT SWITCH

// BOT SMALL SWITCH
function possibleBotSmallSwitch() {
  if (
    mat[7][4].isTaken &&
    mat[7][4].piece.type == "king" &&
    !mat[7][5].isTaken &&
    !mat[7][6].isTaken &&
    mat[7][7].isTaken &&
    mat[7][7].piece.type == "rook" &&
    mat[7][4].piece.color == mat[7][7].piece.color
  ) {
    return true;
  } else {
    return false;
  }
}

function doBotSmallSwitch() {
  focusField = placeWhiteKing;
  clickedField = placeBotSmallSwitch;
  move();
  focusField = mat[7][7];
  clickedField = mat[7][5];
  move();
}

async function sendBotSmallSwitch() {
  sentMove = new OneMove(0, 0, 0, 0, 0, playerType, "BotSmallSwitch");

  console.log("Sending move");

  socket.emit("player-move", { roomName, move: sentMove });

  console.log("Move sent");
}

// BOT BIG SWITCH
function possibleBotBigSwitch() {
  if (
    mat[7][4].isTaken &&
    mat[7][4].piece.type == "king" &&
    !mat[7][3].isTaken &&
    !mat[7][2].isTaken &&
    !mat[7][1].isTaken &&
    mat[7][0].isTaken &&
    mat[7][0].piece.type == "rook" &&
    mat[7][4].piece.color == mat[7][0].piece.color
  ) {
    return true;
  } else {
    return false;
  }
}

function doBotBigSwitch() {
  focusField = placeWhiteKing;
  clickedField = placeBotBigSwitch;
  move();
  focusField = mat[7][0];
  clickedField = mat[7][3];
  move();
}

async function sendBotBigSwitch() {
  sentMove = new OneMove(0, 0, 0, 0, 0, playerType, "BotBigSwitch");

  console.log("Sending move");

  socket.emit("player-move", { roomName, move: sentMove });

  console.log("Move sent");
}

// TOP SWITCH
function doTopSmallSwitch() {
  focusField = placeBlackKing;
  clickedField = placeTopSmallSwitch;
  move();
  focusField = mat[0][7];
  clickedField = mat[0][5];
  move();
}

function doTopBigSwitch() {
  focusField = placeBlackKing;
  clickedField = placeTopBigSwitch;
  move();
  focusField = mat[0][0];
  clickedField = mat[0][3];
  move();
}
