const Field = require("./Field");
const Piece = require("./Piece");

class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.mat = [[], [], [], [], [], [], [], []];

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

    this.mat[blackFigures][1].placePiece(Piece.blackKnight);
    this.mat[blackFigures][6].placePiece(Piece.blackKnight);

    this.mat[blackFigures][2].placePiece(Piece.blackBishop);
    this.mat[blackFigures][5].placePiece(Piece.blackBishop);

    this.mat[blackFigures][3].placePiece(Piece.blackQueen);
    this.mat[blackFigures][4].placePiece(Piece.blackKing);

    // Whites
    for (let j = 0; j < 8; j++) {
      this.mat[whitePawns][j].placePiece(Piece.whitePawn);
    }

    this.mat[whiteFigures][0].placePiece(Piece.whiteRook);
    this.mat[whiteFigures][7].placePiece(Piece.whiteRook);

    this.mat[whiteFigures][1].placePiece(Piece.whiteKnight);
    this.mat[whiteFigures][6].placePiece(Piece.whiteKnight);

    this.mat[whiteFigures][2].placePiece(Piece.whiteBishop);
    this.mat[whiteFigures][5].placePiece(Piece.whiteBishop);

    this.mat[whiteFigures][3].placePiece(Piece.whiteQueen);
    this.mat[whiteFigures][4].placePiece(Piece.whiteKing);
  }

  jsonString() {
    return JSON.stringify(this.mat);
  }
}

module.exports = GameState;

console.log("heyy");

const state = new GameState();

console.log(state.jsonString());
