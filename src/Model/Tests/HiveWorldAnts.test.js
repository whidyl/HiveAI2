import HiveWorld, { Color, ORIGIN, PieceType } from "../HiveWorld.js";

describe("getPlaceMoves()", () => {
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
        let secondMoves = hw.getPlaceMoves(Color.WHITE);

        expect(secondMoves).toContainEqual({pos: ORIGIN.botLeft, piece: whiteAnt});
        expect(secondMoves).toContainEqual({pos: ORIGIN.topRight, piece: whiteAnt});
        expect(secondMoves).toContainEqual({pos: ORIGIN.right, piece: whiteAnt});
    })
});