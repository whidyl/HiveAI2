export default class HiveWorld {
  constructor() {
    this.blackHand = this.makeStartingHand(Color.BLACK);
    this.whiteHand = this.makeStartingHand(Color.WHITE);
    this.board = {};
    this.turn = 0;
  }

  makeStartingHand(color) {
    return new Set([
      new Piece(PieceType.QUEEN, color),
      new Piece(PieceType.SPIDER, color),
      new Piece(PieceType.SPIDER, color),
      new Piece(PieceType.BEETLE, color),
      new Piece(PieceType.BEETLE, color),
      new Piece(PieceType.GRASSHOPPER, color),
      new Piece(PieceType.GRASSHOPPER, color),
      new Piece(PieceType.GRASSHOPPER, color),
      new Piece(PieceType.ANT, color),
      new Piece(PieceType.ANT, color),
      new Piece(PieceType.ANT, color),
    ]);
  }

  doMove(move) {
    this.getHand(move.piece.color).delete(move.piece);
    this.board[move.pos] = move.piece;
    this.turn++;
  }

  getPieceAt(pos) {
    return this.board[pos];
  }

  isEmpty() {
    return true;
  }

  getHand(color) {
    return color === Color.WHITE ? this.whiteHand : this.blackHand;
  }

  getFirstPlaceMoves(color) {
    return [...this.getHand(color)].map((piece) => new Move(piece, ORIGIN));
  }

  getSecondPlaceMoves(color) {
    let moves = [];
      for (const pos of [ORIGIN.topLeft, ORIGIN.topRight, ORIGIN.left, ORIGIN.right, ORIGIN.botLeft, ORIGIN.botRight]) {
        const handAtPos = [...this.getHand(color)].map((piece) => new Move(piece, pos))
        moves.push(...handAtPos);
      }
      return moves;
  }

  getPlaceMoves(color) {
    if (this.turn === 0)
      return this.getFirstPlaceMoves(color);
    else {
      return this.getSecondPlaceMoves(color);
    }
  }
}

export const ORIGIN = {
  topRight: "tr",
  topLeft: "tl",
  left: "l",
  right: "r",
  botLeft: "bl",
  botRight: "br"
}

export class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
  }
}

export class Move {
  constructor(piece, pos) {
    this.piece = piece;
    this.pos = pos;
  }

  equals(otherMove) {
    return Object.is(this.piece, otherMove.piece) && this.pos == otherMove.pos;
  }
}

export const Color = {
  BLACK: "black",
  WHITE: "white",
};

export const PieceType = {
  QUEEN: "queen",
  SPIDER: "spider",
  BEETLE: "beetle",
  GRASSHOPPER: "grasshopper",
  ANT: "ant",
};
