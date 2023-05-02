import HiveWorld, { Color } from './HiveWorld';

export class MinMaxHiveAI {
    constructor(hw) {
        this.hw = hw;
    }

    playMove() {
        const depth = 3; 
        const bestMoveData = this.minimaxAlphaBeta(depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Color.WHITE);
        const bestMove = bestMoveData.move;
        console.log(bestMoveData.value);
        this.hw.doMove(bestMove);
    }

    minimaxAlphaBeta(depth, alpha, beta, maximizingPlayer) {
        const hw = this.hw;
		if (depth === 0 || hw.isGoalState(Color.BLACK) || hw.isGoalState(Color.WHITE)) {
		  return { move: null, value: hw.evaluateState(Color.WHITE) };
		}
	  
		let bestMove = null;
	  

		if (maximizingPlayer === Color.WHITE) {
		  let maxEval = Number.NEGATIVE_INFINITY;
		  const moves = hw.getAllPossibleMoves();
		  for (const move of moves) {
			hw.doMove(move);
			const evalData = this.minimaxAlphaBeta(depth - 1, alpha, beta, Color.BLACK);
			hw.undoMove(move);
	  
			if (evalData.value > maxEval) {
			  maxEval = evalData.value;
			  bestMove = move;
			}
	  
			alpha = Math.max(alpha, evalData.value);
			if (beta <= alpha) {
			  break;
			}
		  }
          //console.log(maxEval);
		  return { move: bestMove, value: maxEval };
		} else if (maximizingPlayer === Color.BLACK) {
		  let minEval = Number.POSITIVE_INFINITY;
		  const moves = hw.getAllPossibleMoves();
		  for (const move of moves) {
			hw.doMove(move);
			const evalData = this.minimaxAlphaBeta(depth - 1, alpha, beta, Color.WHITE);
			hw.undoMove(move);
	  
			if (evalData.value < minEval) {
			  minEval = evalData.value;
			  bestMove = move;
			}
	  
			beta = Math.min(beta, evalData.value);
			if (beta <= alpha) {
			  break;
			}
		  }
          
		  return { move: bestMove, value: minEval };
		}
	}
}