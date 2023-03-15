import HiveWorld, { Color, ORIGIN, PieceType } from "../HiveWorld.js";

describe("getPlaceMoves()", () => {
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
        const firstMove = hw.getPlaceMoves()[0]
        hw.doMove(firstMove);
        const secondMove = hw.getPlaceMoves()[0];
        hw.doMove(secondMove);

        const thirdMoves = hw.getPlaceMoves();
        
        expect(thirdMoves).not.toContainEqual(firstMove);
        expect(thirdMoves).not.toContainEqual(secondMove);
    })

    // test("place third ant includes positions around last move.", () => {
    //     let hw = new HiveWorld();
    //     const firstMove = hw.getPlaceMoves()[0]
    //     hw.doMove(firstMove);
    //     const secondMovePos = firstMove.pos.topLeft;
    //     const secondMove = hw.getPlaceMoves().find(move => Object.is(move.pos, secondMovePos));
    //     hw.doMove(secondMove);

    //     const thirdMoves = hw.getPlaceMoves();
        
    //     expect(thirdMoves).toContainEqual({pos: secondMovePos.left, piece: whiteAnt});
    //     // expect(thirdMoves).not.toContainEqual(secondMove);
    // })

});