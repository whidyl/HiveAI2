export default class HiveWorld {
  constructor() {
    this.blackHand = this.#makeStartingHand(Color.BLACK);
    this.whiteHand = this.#makeStartingHand(Color.WHITE);
    this.board = new Map();
    this.turn = 0;
  }

  get currColor() {
    return ((this.turn % 2) === 0) ? Color.BLACK : Color.WHITE;
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
    this.board.set(move.pos, move.piece);
    this.turn++;
  }

  findPieceAt(pos) {
    const pieceWithPos = this.board.get(pos)
    if (pieceWithPos)
      return pieceWithPos;
    return this.board.get(Array.from(this.board.keys()).find(p => p.equals(pos)));
  }

  isEmpty() {
    return true;
  }

  getHand(color) {
    return color === Color.WHITE ? this.whiteHand : this.blackHand;
  }

  #getFirstTurnPlaceMoves() {
    return [...this.getHand(this.currColor)].map((piece) => new Move(piece, ORIGIN));
  }

  #getSecondTurnPlaceMoves() {
    const placeMoves = this.#getPlaceMovesFromPositionsForEachPieceInHand(ORIGIN.adjacent);
    return placeMoves;
  }

  #getAfterSecondTurnPlaceMoves() {
    const adjPositions = this.#getAllAdjacentPositions();
    const nonAdjToOpponent = this.#filterOutPosAdjToOpponentPieces(adjPositions);
    const placeMoves = this.#getPlaceMovesFromPositionsForEachPieceInHand(nonAdjToOpponent);
    return placeMoves;
  }

  #getAllAdjacentPositions() {
    let positions = [];
    for (const pos of this.getAllPiecePositions()) {
      for (const potentialPos of pos.adjacent) {
        if (this.findPieceAt(potentialPos) === undefined) {
          positions.push(potentialPos);
        }
      }
    }
    return positions;
  }

  #filterOutPosAdjToOpponentPieces(pos) {
    const filtered = pos.filter(pos => {
      for (const adj of pos.adjacent) {
        const adjPiece = this.findPieceAt(adj);
        if (adjPiece !== undefined && adjPiece.color !== this.currColor) {
          return false;
        }
      }
      return true;
    })
    return filtered;
  }

  #getPlaceMovesFromPositionsForEachPieceInHand(positions) {
    let moves = [];
    this.getHand(this.currColor).forEach(piece => {
      for (const pos of positions) {
        moves.push(new Move(piece, pos))
      }
    });
    return moves;
  }

  

  getPlaceMoves() {
    if (this.turn === 0)
      return this.#getFirstTurnPlaceMoves();
    else if (this.turn === 1)
      return this.#getSecondTurnPlaceMoves();
    else {
      return this.#getAfterSecondTurnPlaceMoves();
    }
  }

  getAllPiecePositions() {
    return Array.from(this.board.keys());
  }

  // testing utilities

  findPlaceMoveAt(pos) {
    return this.getPlaceMoves().find(move => 
      move.pos.equals(pos));
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
    return Object.is(this.piece, otherMove.piece) && this.pos.equals(otherMove.pos);
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

  get adjacent() {
    return [this.topLeft, this.topRight, this.left, this.right, this.botLeft, this.botRight];
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
