class Field {
  constructor() {
    this.isTaken = false;
    this.piece = null;
  }

  placePiece(piece) {
    this.isTaken = true;
    this.piece = piece;
  }

  removePiece() {
    this.isTaken = false;
    this.piece = null;
  }
}

module.exports = Field;
