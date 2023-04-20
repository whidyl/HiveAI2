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
      expect(countPieces(handArr, PieceType.ANT)).toBe(10);
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

    test("same piece 'equal' positions, returns true", () => {
      const piece = new Piece(PieceType.ANT, Color.BLACK);

      let move1 = new Move(piece, ORIGIN);
      let move2 = new Move(piece, ORIGIN.top.bot);

      expect(move1.equals(move2)).toBe(true);
    });
  });
});

describe("getPlaceMoves(Color)", () => {
  test("first move, returns any BLACK piece at ORIGIN", () => {
    let hiveWorld = new HiveWorld();
    const hand = hiveWorld.getHand(Color.BLACK);

    const moves = hiveWorld.getPlaceMoves();

    hand.forEach((piece) => {
      expect(moves).toContainEqual(new Move(piece, ORIGIN));
    });
  });

  test("after first placement, returns positions around first tile.", () => {
    let hw = new HiveWorld();
    hw.doMove(hw.findPlaceMoveAt(ORIGIN));

    const placeMoves = hw.getPlaceMoves();

    hw.getHand(Color.WHITE).forEach(piece => {
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.topRight));
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.topLeft));
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.top));
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.bot));
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.botLeft))
      expect(placeMoves).toContainEqual(new Move(piece, ORIGIN.botRight));
    });
  });
});

describe("getPlaceMoveAt", () => {
  test("after move at origin, gets black piece there", () => {
    let hw = new HiveWorld();
    const move = hw.findPlaceMoveAt(ORIGIN)
    hw.doMove(move);

    const piece = hw.findPieceAt(ORIGIN);

    expect(piece.color).toBe(Color.BLACK);
  });

  test("after move at origin, gets piece at new pos defined at origin.", () => {
    let hw = new HiveWorld();
    const move = hw.findPlaceMoveAt(ORIGIN)
    hw.doMove(move);

    const piece = hw.findPieceAt(new HexPos(0, 0, 0));

    expect(piece).not.toBeNull();
    expect(piece).not.toBeUndefined();
  });

  test("after move at origin, gets undefined elsewhere", () => {
    let hw = new HiveWorld();
    const move = hw.findPlaceMoveAt(ORIGIN)
    hw.doMove(move);

    const piece = hw.findPieceAt(ORIGIN.top);

    expect(piece).toBeUndefined();
  });
})

describe("doMove(Move)", () => {
  test("first placement of some piece, piece is at origin", () => {
    let hiveWorld = new HiveWorld();
    const someMove = hiveWorld.findPlaceMoveAt(ORIGIN);

    hiveWorld.doMove(someMove);

    expect(hiveWorld.findPieceAt(ORIGIN)).toBe(someMove.piece);
    expect(hiveWorld.getHand(Color.BLACK).size).toBe(10);
  });
});

describe("HexPos", () => {
  test.each([
    [0, 0],
    [-5, -3],
    [1, 2]
  ])("Two Pos constructed with same coords are equal", (x, y) => {
    const pos1 = new HexPos(x, y);
    const pos2 = new HexPos(x, y);

    expect(pos1.equals(pos2)).toBe(true);
  });

  test("Two Pos constructed with diff coords are equal", () => {
    const pos1 = new HexPos(5, 0);
    const pos2 = new HexPos(0, 5);
    const pos3 = new HexPos(0, 0);

    expect(pos1.equals(pos2)).toBe(false);
    expect(pos2.equals(pos3)).toBe(false);
    expect(pos3.equals(pos1)).toBe(false);

  });

  test("Pos directions return expected coords", () => {
    const pos = new HexPos(0, 0);

    expect(pos.top.equals(new HexPos(0, -1))).toBe(true);
    expect(pos.bot.equals(new HexPos(0, 1))).toBe(true);
    expect(pos.topLeft.equals(new HexPos(-1, 0))).toBe(true);
    expect(pos.botRight.equals(new HexPos(1, 0))).toBe(true);
    expect(pos.topRight.equals(new HexPos(1, -1))).toBe(true);
    expect(pos.botLeft.equals(new HexPos(-1, 1))).toBe(true);
  });

  test("Equal positions arrived by different routes are equal.", () => {
    const pos = new HexPos(0, 0, 0);

    expect(pos.top.topRight).toStrictEqual(pos.topRight.top);
    expect(pos.botRight.botRight).toStrictEqual(pos.bot.botRight.botRight.top);
  });
});

describe("findPlaceMoveAt", () => {
  test("first move, gets move at origin.", () => {
    const hw = new HiveWorld();
    
    const move = hw.findPlaceMoveAt(ORIGIN);

    expect(move).not.toBeUndefined();
    expect(move.pos).toStrictEqual(ORIGIN)
  });

  test("first move, gets undefined beside origin.", () => {
    const hw = new HiveWorld();
    
    const move = hw.findPlaceMoveAt(ORIGIN.top);

    expect(move).toBeUndefined();
  });
})

describe("isPosFreeAndAdjToAnyPiece", () => {
  test("first move, true next to it but not on it.", () => {
    const hw = new HiveWorld();
    
    hw.doMove(hw.findPlaceMoveAt(ORIGIN));

    expect(hw.isPosFreeAndAdjToAnyPieceExcluding(ORIGIN.botLeft, ORIGIN.botLeft)).toBe(true);
    expect(hw.isPosFreeAndAdjToAnyPieceExcluding(ORIGIN.botLeft, ORIGIN)).toBe(false);
    expect(hw.isPosFreeAndAdjToAnyPieceExcluding(ORIGIN, ORIGIN.top.top)).toBe(false);
    expect(hw.isPosFreeAndAdjToAnyPieceExcluding(ORIGIN.botLeft.bot, ORIGIN.top.top)).toBe(false);
  })
})

describe("getAllPiecePositions()", () => {
  test("after first move, gets single origin pos.", () => {
    const hw = new HiveWorld();
    hw.doMove(hw.findPlaceMoveAt(ORIGIN));

    const positions = hw.getAllPiecePositions();

    expect(positions.length).toBe(1);
    expect(positions[0]).toStrictEqual(ORIGIN)
  })
});
