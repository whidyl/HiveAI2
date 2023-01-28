import HiveWorld from "../HiveWorld";
import { Color, Piece, PieceType, Move, ORIGIN } from "../HiveWorld";

describe("isEmpty()", () => {
  test("new HiveWorld, is true", () => {
    let hiveWorld = new HiveWorld();

    expect(hiveWorld.isEmpty()).toBe(true);
  });
});

const countPieces = (arr, pieceType) => {
  return arr.filter((piece) => piece.type === pieceType).length;
};

describe("getHand(Color)", () => {
  test.each([[Color.BLACK], [Color.WHITE]])(
    "%p hand for new hiveWorld, has Hive starting hand",
    (color) => {
      let hiveWorld = new HiveWorld();

      const handArr = [...hiveWorld.getHand(color)];

      expect(countPieces(handArr, PieceType.QUEEN)).toBe(1);
      expect(countPieces(handArr, PieceType.SPIDER)).toBe(2);
      expect(countPieces(handArr, PieceType.BEETLE)).toBe(2);
      expect(countPieces(handArr, PieceType.GRASSHOPPER)).toBe(3);
      expect(countPieces(handArr, PieceType.ANT)).toBe(3);
    }
  );

  test.each([[Color.BLACK], [Color.WHITE]])(
    "%p hand for new hiveWorld, has correct color pieces",
    (color) => {
      let hiveWorld = new HiveWorld();

      const handArr = [...hiveWorld.getHand(color)];

      expect(handArr.every((piece) => piece.color === color)).toBe(true);
    }
  );
});

describe("Move", () => {
  describe("equals(Move)", () => {
    test("same piece at origin, returns true", () => {
      const piece = new Piece(PieceType.ANT, Color.BLACK);

      let move1 = new Move(piece, ORIGIN);
      let move2 = new Move(piece, ORIGIN);

      expect(move1.equals(move2)).toBe(true);
    });
  });
});

describe("getPlaceMoves(Color)", () => {
  test("first move, returns any piece at origin", () => {
    let hiveWorld = new HiveWorld();
    const hand = hiveWorld.getHand(Color.BLACK);

    const moves = hiveWorld.getPlaceMoves(Color.BLACK);

    hand.forEach((piece) => {
      expect(movesContains(moves, new Move(piece, ORIGIN))).toBe(true);
    });
  });
});

describe("doMove(Move)", () => {
  test("first placement of some piece, piece is at origin", () => {
    let hiveWorld = new HiveWorld();
    const move = [...hiveWorld.getPlaceMoves(Color.WHITE)][0];

    hiveWorld.doMove(move);

    expect(hiveWorld.getPieceAt(ORIGIN)).toBe(move.piece);
    expect(hiveWorld.getHand(Color.WHITE).size).toBe(10);
  });
});

const movesContains = (moves, move) => {
  let isContained = false;
  moves.forEach((m) => {
    if (move.equals(m)) {
      isContained = true;
    }
  });
  return isContained;
};
