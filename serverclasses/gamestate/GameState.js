const Field = require("./Field");
const Piece = require("./Piece");

class GameState {
  constructor() {
    this.mat;
    this.turn;

    this.reset();
  }

  reset() {
    this.mat = [[], [], [], [], [], [], [], []];
    this.turn = 0;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this.mat[i][j] = new Field();
      }
    }

    let blackFigures = 0;
    let blackPawns = 1;

    let whitePawns = 6;
    let whiteFigures = 7;

    // Blacks
    for (let j = 0; j < 8; j++) {
      this.mat[blackPawns][j].placePiece(Piece.blackPawn);
    }

    this.mat[blackFigures][0].placePiece(Piece.blackRook);
    this.mat[blackFigures][7].placePiece(Piece.blackRook);

    // this.mat[blackFigures][1].placePiece(Piece.blackKnight);
    // this.mat[blackFigures][6].placePiece(Piece.blackKnight);

    // this.mat[blackFigures][2].placePiece(Piece.blackBishop);
    // this.mat[blackFigures][5].placePiece(Piece.blackBishop);

    // this.mat[blackFigures][3].placePiece(Piece.blackQueen);
    this.mat[blackFigures][4].placePiece(Piece.blackKing);

    // Whites
    for (let j = 0; j < 8; j++) {
      this.mat[whitePawns][j].placePiece(Piece.whitePawn);
    }

    this.mat[whiteFigures][0].placePiece(Piece.whiteRook);
    this.mat[whiteFigures][7].placePiece(Piece.whiteRook);

    // this.mat[whiteFigures][1].placePiece(Piece.whiteKnight);
    // this.mat[whiteFigures][6].placePiece(Piece.whiteKnight);

    // this.mat[whiteFigures][2].placePiece(Piece.whiteBishop);
    // this.mat[whiteFigures][5].placePiece(Piece.whiteBishop);

    // this.mat[whiteFigures][3].placePiece(Piece.whiteQueen);
    this.mat[whiteFigures][4].placePiece(Piece.whiteKing);
  }

  move({ fromRow, fromCol, toRow, toCol, player, special }) {
    // If its a switch
    if (special) {
      // White switches
      if (special == "BotSmallSwitch" && player === 0) {
        this.doBotSmallSwitch();
      }
      if (special == "BotBigSwitch" && player === 0) {
        this.doBotBigSwitch();
      }
      // Black switches
      if (special == "BotSmallSwitch" && player === 1) {
        this.doTopSmallSwitch();
      }
      if (special == "BotBigSwitch" && player === 1) {
        this.doTopBigSwitch();
      }
    } else {
      //// If its not a switch

      // black players moves need a flip
      if (player === 1) {
        fromRow = 7 - fromRow;
        toRow = 7 - toRow;
      }

      this.doMove(fromRow, fromCol, toRow, toCol);
    }

    // After every move, change states turn
    this.turn = (this.turn + 1) % 2;
  }

  doMove(fromRow, fromCol, toRow, toCol) {
    const fromField = this.mat[fromRow][fromCol];
    const toField = this.mat[toRow][toCol];

    toField.isTaken = true;
    toField.piece = fromField.piece;

    fromField.isTaken = false;
    fromField.piece = null;
  }

  doBotSmallSwitch() {
    // Move white king
    this.doMove(7, 4, 7, 6);

    // Move white rook
    this.doMove(7, 7, 7, 5);
  }

  doTopSmallSwitch() {
    // Move black king
    this.doMove(0, 4, 0, 6);

    // Move blac rook
    this.doMove(0, 7, 0, 5);
  }

  doBotBigSwitch() {
    // Move white king
    this.doMove(7, 4, 7, 2);

    // Move white rook
    this.doMove(7, 0, 7, 3);
  }

  doTopBigSwitch() {
    // Move white king
    this.doMove(0, 4, 0, 2);

    // Move white rook
    this.doMove(0, 0, 0, 3);
  }
}

module.exports = GameState;
