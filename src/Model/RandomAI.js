import HiveWorld from './HiveWorld';

export class RandomHiveAI {
    constructor(hw) {
        this.hw = hw;
    }

    playMove() {
        const allMoves = this.hw.getAllPossibleMoves();
        if (allMoves.length > 0) {
            const randomIndex = Math.floor(Math.random() * allMoves.length);
            const randomMove = allMoves[randomIndex];
            this.hw.doMove(randomMove);
        }
    }
}