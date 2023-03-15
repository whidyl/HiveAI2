export default class HiveWorld {
  constructor() {
    this.blackHand = this.#makeStartingHand(Color.BLACK);
    this.whiteHand = this.#makeStartingHand(Color.WHITE);
    this.board = {};
    this.turn = 0;
  }

  get currColor() {
    return ((this.turn % 2) === 0) ? Color.WHITE : Color.BLACK;
  }

  #makeStartingHand(color) {
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

  getFirstPlaceMoves() {
    return [...this.getHand(this.currColor)].map((piece) => new Move(piece, ORIGIN));
  }

  getSecondPlaceMoves() {
    let moves = [];
      for (const pos of [ORIGIN.topLeft, ORIGIN.topRight, ORIGIN.left, ORIGIN.right, ORIGIN.botLeft, ORIGIN.botRight]) {
        const handAtPos = [...this.getHand(this.currColor)].map((piece) => new Move(piece, pos))
        moves.push(...handAtPos);
      }
      return moves;
  }

  getPlaceMoves() {
    if (this.turn === 0)
      return this.getFirstPlaceMoves();
    
    // let moves = new Set();
    // this.getHand(this.currColor).forEach(piece => {
    //   for (const pos in this.board) {
    //     moves.add(new Move(piece, pos.topLeft));
    //     moves.add(new Move(piece, pos.topRight));
    //     moves.add(new Move(piece, pos.left));
    //     moves.add(new Move(piece, pos.right));
    //     moves.add(new Move(piece, pos.botLeft));
    //     moves.add(new Move(piece, pos.botRight));
    //   }
    // });
    
    return this.getSecondPlaceMoves();
    
  }
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

export class HexPos {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  equals(other) {
    return (this.x === other.x && this.y === other.y && this.z === other.z );
  }

  get left() {
    return new HexPos(this.x - 1, this.y, this.z + 1);
  }

  get right() {
    return new HexPos(this.x + 1, this.y, this.z - 1);
  }

  get topLeft() {
    return new HexPos(this.x, this.y - 1, this.z + 1);
  }

  get botRight() {
    return new HexPos(this.x, this.y + 1, this.z - 1);
  }

  get topRight() {
    return new HexPos(this.x + 1, this.y - 1, this.z);
  }

  get botLeft() {
    return new HexPos(this.x - 1, this.y + 1, this.z);
  }
}

export const ORIGIN = new HexPos(0, 0, 0);

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
