import HiveWorld from "../HiveWorld";
import { Color, Piece, PieceType, Move, HexPos, ORIGIN } from "../HiveWorld";

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
  test("first move, returns any WHITE piece at ORIGIN", () => {
    let hiveWorld = new HiveWorld();
    const hand = hiveWorld.getHand(Color.WHITE);

    const moves = hiveWorld.getPlaceMoves();

    hand.forEach((piece) => {
      expect(movesContains(moves, new Move(piece, ORIGIN))).toBe(true);
    });
  });

  test("after first placement, returns positions around first tile.", () => {
    let hw = new HiveWorld();
    hw.doMove([...hw.getPlaceMoves(Color.WHITE)][0]);

    const placeMoves = hw.getPlaceMoves(Color.BLACK);

    hw.getHand(Color.BLACK).forEach(piece => {
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.topRight));
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.topLeft));
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.left));
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.right));
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.botLeft))
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.botRight));
    });
  });
});

describe("doMove(Move)", () => {
  test("first placement of some piece, piece is at origin", () => {
    let hiveWorld = new HiveWorld();
    const someMove = [...hiveWorld.getPlaceMoves(Color.WHITE)][0];

    hiveWorld.doMove(someMove);

    expect(hiveWorld.getPieceAt(ORIGIN)).toBe(someMove.piece);
    expect(hiveWorld.getHand(Color.WHITE).size).toBe(10);
  });
});

describe("Pos", () => {
  test.each([
    [0, 0, 0],
    [-5, -3, -1],
    [1, 2, 3]
  ])("Two Pos constructed with same coords are equal", (x, y, z) => {
    const pos1 = new HexPos(x, y, z);
    const pos2 = new HexPos(x, y, z);

    expect(pos1.equals(pos2)).toBe(true);
  });

  test("Two Pos constructed with diff coords are equal", () => {
    const pos1 = new HexPos(5, 0, 0);
    const pos2 = new HexPos(0, 5, 0);
    const pos3 = new HexPos(0, 0, 5);

    expect(pos1.equals(pos2)).toBe(false);
    expect(pos2.equals(pos3)).toBe(false);
    expect(pos3.equals(pos1)).toBe(false);

  });

  test("Pos directions return expected coords", () => {
    const pos = new HexPos(0, 0, 0);

    expect(pos.left.equals(new HexPos(-1, 0, 1))).toBe(true);
    expect(pos.right.equals(new HexPos(1, 0, -1))).toBe(true);
    expect(pos.topLeft.equals(new HexPos(0, -1, 1))).toBe(true);
    expect(pos.botRight.equals(new HexPos(0, 1, -1))).toBe(true);
    expect(pos.topRight.equals(new HexPos(1, -1, 0))).toBe(true);
    expect(pos.botLeft.equals(new HexPos(-1, 1, 0))).toBe(true);
  });

  test("Equal positions arrived by different routes are equal.", () => {
    const pos = new HexPos(0, 0, 0);

    expect(pos.left.topRight).toStrictEqual(pos.right.topLeft.left);
    expect(pos.botRight.botRight).toStrictEqual(pos.right.right.botLeft.botLeft);
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
