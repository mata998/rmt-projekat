class Piece {
  constructor(type, color, imgSrc) {
    this.type = type;
    this.color = color;
    this.imgSrc = imgSrc;
  }

  static blackPawn = new Piece("pawn-black", "black", "../imgs/black/pawn.png");
  static blackBishop = new Piece("bishop", "black", "../imgs/black/bishop.png");
  static blackKing = new Piece("king", "black", "../imgs/black/king.png");
  static blackQueen = new Piece("queen", "black", "../imgs/black/queen.png");
  static blackRook = new Piece("rook", "black", "../imgs/black/rook.png");
  static blackKnight = new Piece("knight", "black", "../imgs/black/knight.png");

  static whitePawn = new Piece("pawn-white", "white", "../imgs/white/pawn.png");
  static whiteBishop = new Piece("bishop", "white", "../imgs/white/bishop.png");
  static whiteKing = new Piece("king", "white", "../imgs/white/king.png");
  static whiteQueen = new Piece("queen", "white", "../imgs/white/queen.png");
  static whiteRook = new Piece("rook", "white", "../imgs/white/rook.png");
  static whiteKnight = new Piece("knight", "white", "../imgs/white/knight.png");
}

module.exports = Piece;
