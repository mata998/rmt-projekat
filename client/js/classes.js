// Field class
class Field {
  constructor(row, col) {
    this.element = document.createElement("div");
    this.element.classList = "field";
    this.element.id = `${row}${col}`;
    this.element.innerHTML = '<img src="">';

    this.row = row;
    this.col = col;
    this.isTaken = false;
    this.piece = null;
  }

  placePiece(piece) {
    this.piece = piece;
    this.element.firstChild.src = piece.imgSrc;
    this.isTaken = true;
  }

  removePiece() {
    this.piece = null;
    this.element.firstChild.src = "";
    this.isTaken = false;
  }

  highlight() {
    this.element.classList.add("highlight-field");
  }

  highlightRed() {
    this.element.classList.add("highlight-red");
  }

  removeHighlight() {
    this.element.classList.remove("highlight-field");
    this.element.classList.remove("highlight-red");
  }

  opponentMoveHighlight() {
    this.element.classList.add("opponent-red");
  }

  removeOpponentMoveHighlight() {
    this.element.classList.remove("opponent-red");
  }
}

// Piece class

class Piece {
  constructor(type, color, imgSrc) {
    this.type = type;
    this.color = color;
    this.imgSrc = imgSrc;
  }
}

// One move class
class OneMove {
  constructor(
    fromRow,
    fromCol,
    toRow,
    toCol,
    eatenPiece,
    player,
    special = ""
  ) {
    this.fromRow = fromRow;
    this.fromCol = fromCol;
    this.toRow = toRow;
    this.toCol = toCol;
    this.eatenPiece = eatenPiece;
    this.special = special;
    this.player = player;
  }

  static equals(oneMove, otherMove) {
    if (
      oneMove.special == otherMove.special &&
      oneMove.fromRow == otherMove.fromRow &&
      oneMove.fromCol == otherMove.fromCol &&
      oneMove.toCol == otherMove.toCol &&
      oneMove.fromRow == otherMove.fromRow &&
      oneMove.player == otherMove.player
    ) {
      return true;
    } else {
      return false;
    }
  }

  static flip(move) {
    return new OneMove(
      7 - move.fromRow,
      move.fromCol,
      7 - move.toRow,
      move.toCol,
      move.eatenPiece,
      move.special
    );
  }
}
