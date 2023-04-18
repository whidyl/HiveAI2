import HiveWorld, { Color, ORIGIN, PieceType } from "../HiveWorld.js";

function pickRandomAntMove(hw) {
    const antMoves = hw.getPlaceMoves().filter(move => move.piece.type === PieceType.ANT);
    return getRandomItemFromArray(antMoves);

}

function pickRandomQueenMove(hw) {
    const antMoves = hw.getPlaceMoves().filter(move => move.piece.type === PieceType.QUEEN);
    return getRandomItemFromArray(antMoves);

}

function getRandomItemFromArray(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

describe("pickRandomAntMove", () => {
    test("one move: gets single move", () => {
        const hw = new HiveWorld();
     
        const antMove = pickRandomAntMove(hw);
     
        expect(antMove.pos.equals(ORIGIN)).toBe(true);
     })

     test("pickRandomAntMove2", () => {
        const hw = new HiveWorld();
     
        hw.doMove(pickRandomAntMove(hw));
        hw.doMove(pickRandomAntMove(hw));
        hw.doMove(pickRandomAntMove(hw));
        hw.doMove(pickRandomAntMove(hw));
     
        expect(hw.getAllPiecePositions().length).toBe(4);
     })
})





describe("getPlaceMoves() and findPlaceMoveAt(HexPos)", () => {
    const whiteAnt = {type: PieceType.ANT, color: Color.WHITE};
    const blackAnt = {type: PieceType.ANT, color: Color.BLACK};
    const blackQueen = {type: PieceType.QUEEN, color: Color.BLACK};

    test("place ant is in first place moves.", () => {
        let hw = new HiveWorld();

        let placeMoves = hw.getPlaceMoves();

        expect(placeMoves).toContainEqual({pos: ORIGIN, piece: blackAnt});
    })

    test("first place moves has 2: (queen and ant)", () => {
        let hw = new HiveWorld();

        let placeMoves = hw.getPlaceMoves();

        expect(placeMoves).toContainEqual({pos: ORIGIN, piece: blackQueen})
        expect(placeMoves.length).toBe(2);
    })

    test("after turn 6 without queen placed: can only place queen", () => {
        let hw = new HiveWorld();

        hw.doMove(pickRandomAntMove(hw));
        hw.doMove(pickRandomAntMove(hw));
        hw.doMove(pickRandomAntMove(hw));
        hw.doMove(pickRandomAntMove(hw));
        hw.doMove(pickRandomAntMove(hw));
        hw.doMove(pickRandomAntMove(hw));

        const placeMoves= hw.getPlaceMoves();

        expect(hw.getAllPiecePositions().length).toBe(6);
        expect(hw.turn).toBe(6);
        expect(placeMoves.every(move => move.piece.type === PieceType.QUEEN)).toBe(true);
    })
    
    test("place second ant is around origin.", () => {
        let hw = new HiveWorld();
        
        let firstMoves = hw.getPlaceMoves();
        hw.doMove(firstMoves[0]);
        let secondMoves = hw.getPlaceMoves();

        expect(secondMoves).toContainEqual({pos: ORIGIN.botLeft, piece: whiteAnt});
        expect(secondMoves).toContainEqual({pos: ORIGIN.topRight, piece: whiteAnt});
        expect(secondMoves).toContainEqual({pos: ORIGIN.top, piece: whiteAnt});
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
        expect(hw.findPlaceMoveAt(whiteMove.pos.bot)).toBeUndefined();
        expect(hw.findPlaceMoveAt(whiteMove.pos.top)).toBeUndefined();
    })

    test("third ant place moves, includes free tiles around first placed (not touching opponent).", () => {
        let hw = new HiveWorld();
        const move1 = hw.findPlaceMoveAt(ORIGIN)
        hw.doMove(move1);
        const move2 = hw.findPlaceMoveAt(ORIGIN.topLeft);
        hw.doMove(move2);
        
        expect(hw.findPlaceMoveAt(move1.pos.topRight)).not.toBeUndefined();
        expect(hw.findPlaceMoveAt(move1.pos.botRight)).not.toBeUndefined();
        expect(hw.findPlaceMoveAt(move1.pos.bot)).not.toBeUndefined();
    })
});

describe("getPieces(Color)", () => {
    test("After first place move, gets single piece", () => {
        let hw = new HiveWorld();
        const move1 = hw.findPlaceMoveAt(ORIGIN);
        hw.doMove(move1);

        const pieces = hw.getPieces(Color.BLACK);

        expect(pieces.length).toBe(1);
    })
})

describe("getPieceMoves(Pos)", () => {
    test("move opponent piece, returns empty", () => {
        let hw = new HiveWorld();
        const move = hw.findPlaceMoveAt(ORIGIN)
        hw.doMove(move);

        const moves = hw.getPieceMoves(ORIGIN);

        expect(moves.length).toBe(0);
    })

    test("move ant after queen moved: returns expected moves", () => {
        let hw = new HiveWorld();
        hw.doMove(pickRandomQueenMove(hw));
        hw.doMove(hw.findPlaceMoveAt(ORIGIN.topLeft));

        hw.doMove(hw.findPlaceMoveAt(ORIGIN.botRight));
        const pieceMoves = hw.getPieceMoves(ORIGIN.topLeft);

        expect(pieceMoves.length).toBe(9);
    })

    
})

test("Iterate with dictionary", () => {
    let hw = new HiveWorld();
    const move1 = hw.findPlaceMoveAt(ORIGIN)
    hw.doMove(move1);
    const move2 = hw.findPlaceMoveAt(ORIGIN.topLeft);
    hw.doMove(move2);

    hw.board.forEach((piece, pos) => {
        expect(piece.type).not.toBeUndefined();
        expect(pos.r).not.toBeUndefined();
    });
})