import HiveWorld from './HiveWorld';

export class MinMaxHiveAI {
    constructor(hw) {
        this.hw = hw;
    }

    playMove() {
        const depth = 3; // Adjust the depth depending on the complexity and performance
        const bestMoveData = this.hw.minimaxAlphaBeta(depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
        const bestMove = bestMoveData.move;
        this.hw.doMove(bestMove);
    }
}