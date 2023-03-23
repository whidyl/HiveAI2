import HiveWorld, { Color, ORIGIN, PieceType } from "../HiveWorld.js";

describe("getPlaceMoves() and findPlaceMoveAt(HexPos)", () => {
    const whiteAnt = {type: PieceType.ANT, color: Color.WHITE};
    const blackAnt = {type: PieceType.ANT, color: Color.BLACK};

    test("place ant is in first place moves.", () => {
        let hw = new HiveWorld();

        let placeMoves = hw.getPlaceMoves();

        expect(placeMoves).toContainEqual({pos: ORIGIN, piece: blackAnt});
    })
    
    test("place second ant is around origin.", () => {
        let hw = new HiveWorld();
        
        let firstMoves = hw.getPlaceMoves();
        hw.doMove(firstMoves[0]);
        let secondMoves = hw.getPlaceMoves();

        expect(secondMoves).toContainEqual({pos: ORIGIN.botLeft, piece: whiteAnt});
        expect(secondMoves).toContainEqual({pos: ORIGIN.topRight, piece: whiteAnt});
        expect(secondMoves).toContainEqual({pos: ORIGIN.right, piece: whiteAnt});
        expect(secondMoves).not.toContainEqual({pos: ORIGIN, piece: firstMoves[0].piece});
    })

    test("place third ant does not include blocked tiles.", () => {
        let hw = new HiveWorld();
        const move1 = hw.findPlaceMoveAt(ORIGIN);
        hw.doMove(move1);
        const move2 = hw.findPlaceMoveAt(ORIGIN.topLeft);
        hw.doMove(move2);

        expect(hw.findPlaceMoveAt(ORIGIN)).toBeUndefined();
        expect(hw.findPlaceMoveAt(ORIGIN.topLeft)).toBeUndefined();
    })

    test("white placed top left of black, allowed placements does not contain any around white.", () => {
        let hw = new HiveWorld();
        const blackMove = hw.findPlaceMoveAt(ORIGIN);
        hw.doMove(blackMove);
        const whiteMove = hw.findPlaceMoveAt(ORIGIN.topLeft);
        hw.doMove(whiteMove);

        expect(hw.findPlaceMoveAt(whiteMove.pos.botLeft)).toBeUndefined();
        expect(hw.findPlaceMoveAt(whiteMove.pos.left)).toBeUndefined();
        expect(hw.findPlaceMoveAt(whiteMove.pos.right)).toBeUndefined();
        expect(hw.findPlaceMoveAt(blackMove.pos.right)).not.toBeUndefined();
    })

    test("third ant place moves, includes free tiles around first placed (not touching opponent).", () => {
        let hw = new HiveWorld();
        const move1 = hw.findPlaceMoveAt(ORIGIN)
        hw.doMove(move1);
        const move2 = hw.findPlaceMoveAt(ORIGIN.topLeft);
        hw.doMove(move2);
        
        expect(hw.findPlaceMoveAt(move1.pos.right)).not.toBeUndefined();
        expect(hw.findPlaceMoveAt(move1.pos.botRight)).not.toBeUndefined();
        expect(hw.findPlaceMoveAt(move1.pos.botLeft)).not.toBeUndefined();
    })
});