import HiveWorld, { Color, ORIGIN, PieceType } from "../HiveWorld.js";

describe("getPlaceMoves() and findPlaceMoveAt(HexPos)", () => {
    const whiteAnt = {type: PieceType.ANT, color: Color.WHITE};
    const blackAnt = {type: PieceType.ANT, color: Color.BLACK};

    test("place ant is in first place moves.", () => {
        let hw = new HiveWorld();

        let placeMoves = hw.getPlaceMoves();

        expect(placeMoves).toContainEqual({pos: ORIGIN, piece: whiteAnt});
    })
    
    test("place second ant is around origin.", () => {
        let hw = new HiveWorld();
        
        let firstMoves = hw.getPlaceMoves();
        hw.doMove(firstMoves[0]);
        let secondMoves = hw.getPlaceMoves();

        expect(secondMoves).toContainEqual({pos: ORIGIN.botLeft, piece: blackAnt});
        expect(secondMoves).toContainEqual({pos: ORIGIN.topRight, piece: blackAnt});
        expect(secondMoves).toContainEqual({pos: ORIGIN.right, piece: blackAnt});
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

    test("third ant place moves, includes free tiles around last placed.", () => {
        let hw = new HiveWorld();
        const move1 = hw.findPlaceMoveAt(ORIGIN)
        hw.doMove(move1);
        const move2 = hw.findPlaceMoveAt(ORIGIN.topLeft);
        hw.doMove(move2);
        
        expect(hw.findPlaceMoveAt(ORIGIN.left)).not.toBeUndefined();
        expect(hw.findPlaceMoveAt(move2.pos.topRight)).not.toBeUndefined();
        expect(hw.findPlaceMoveAt(move2.pos.botLeft)).not.toBeUndefined();
        // expect(thirdMoves).not.toContainEqual(secondMove);
    })
});