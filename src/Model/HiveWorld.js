export default class HiveWorld {
	constructor(copyFrom = null) {
		if (copyFrom !== null) {
			this.blackHand = copyFrom.blackHand;
			this.whiteHand = copyFrom.whiteHand;
			this.board = copyFrom.board;
			this.turn = copyFrom.turn;
			this.size = copyFrom.size;
			this.whiteQueenPos = copyFrom.whiteQueenPos;
			this.blackQueenPos = copyFrom.blackQueenPos;
		} else {
			this.blackHand = this.#makeStartingHand(Color.BLACK);
			this.whiteHand = this.#makeStartingHand(Color.WHITE);
			this.board = new Map();
			this.turn = 0;
			this.size = 0;
			this.whiteQueenPos = null;
			this.blackQueenPos = null;
		}
	}

	get currColor() {
		return this.turn % 2 === 0 ? Color.BLACK : Color.WHITE;
	}

	get opponentColor() {
		return this.turn % 2 === 0 ? Color.WHITE : Color.BLACK;
	}


	#makeStartingHand(color) {
		return new Set([
			new Piece(PieceType.QUEEN, color),
			new Piece(PieceType.ANT, color),
			new Piece(PieceType.ANT, color),
			new Piece(PieceType.ANT, color),
			new Piece(PieceType.ANT, color),
			new Piece(PieceType.ANT, color),
			new Piece(PieceType.ANT, color),
			new Piece(PieceType.ANT, color),
			new Piece(PieceType.ANT, color),
			new Piece(PieceType.ANT, color),
			new Piece(PieceType.ANT, color),
		]);
	}

	isGoalState(color) {
		if (this.blackQueenPos && color === Color.WHITE)
			return this.isPosSurrounded(this.blackQueenPos);
		else if (this.whiteQueenPos && color === Color.BLACK)
			return this.isPosSurrounded(this.whiteQueenPos);
		return false;
	}

	evaluateState() {
		if (this.isGoalState(this.opponentColor))
			return -1000;
		if (this.isGoalState(this.currColor)) {
			return 1000;
		}
		else {
			if (this.currColor === Color.BLACK) 
				return this.evalPiecesAround(this.whiteQueenPos) - this.evalPiecesAround(this.blackQueenPos);
			else if (this.currColor === Color.WHITE) 
				return this.evalPiecesAround(this.blackQueenPos) - this.evalPiecesAround(this.whiteQueenPos);
		}
	}

	evalPiecesAround(pos) {
		if (pos === null)
			return -1
		
		let count = 0;
		pos.adjacent.forEach(pos => {
			const piece = this.findPieceAt(pos);
			if (piece) {
				count += 1;
			}
		})
		return count;
	}

	isPosSurrounded(pos) {
		return pos.adjacent.every(pos => this.findPieceAt(pos));
	}

	doMove(move) {
		if (move.prev)
			this.board.delete(move.prev.toString());
		else {
			this.getHand(move.piece.color).delete(move.piece);
			this.size++;
		}
			
		this.board.set(move.pos.toString(), move.piece);
		if (move.piece.type === PieceType.QUEEN)
				this.updateQueenPosByMove(move);
		
		this.turn++;
	}

	undoMove(move) {
		// Remove the piece from its current position
		this.board.delete(move.pos.toString());
	  
		if (move.prev) {
		  // Move the piece back to its previous position
		  this.board.set(move.prev.toString(), move.piece);
		} else {
		  // Add the piece back to the hand
		  this.getHand(move.piece.color).add(move.piece);
		  this.size--;
		}
	  
		// Update the queen position if necessary
		if (move.piece.type === PieceType.QUEEN) {
		  if (move.piece.color === Color.BLACK) {
			this.blackQueenPos = move.prev;
		  } else if (move.piece.color === Color.WHITE) {
			this.whiteQueenPos = move.prev;
		  }
		}
	  
		this.turn--;
	  }

	updateQueenPosByMove(move) {
		if (move.piece.color === Color.BLACK)
			this.blackQueenPos = move.pos;
		else if (move.piece.color === Color.WHITE)
			this.whiteQueenPos = move.pos;
	}

	// returns piece if it exists, otherwise undefined
	findPieceAt(pos) {
		return this.board.get(pos.toString());
	}

	getPieces(color) {
		let result = [];
		this.getAllPiecePositions().forEach((pos) => {
			const piece = this.findPieceAt(pos);
			if (piece.color === color) {
				result.push(piece);
			}
		});
		return result;
	}

	isEmpty() {
		return true;
	}

	getHand(color) {
		return color === Color.WHITE ? this.whiteHand : this.blackHand;
	}

	getQueenInHand() {
		for (const piece of this.getHand(this.currColor)) {
			if (piece.type === PieceType.QUEEN) {
				return piece;
			}
		}
		return undefined;
	}

	getFirstOfEachPieceInHand() {
		let result = [];
		let includedType = new Set();
		this.getHand(this.currColor).forEach((piece) => {
			if (!includedType.has(piece.type)) {
				includedType.add(piece.type);
				result.push(piece);
			}
		});
		return result;
	}

	#getFirstTurnPlaceMoves() {
		return [...this.getFirstOfEachPieceInHand()].map(
			(piece) => new Move(piece, ORIGIN)
		);
	}

	#getSecondTurnPlaceMoves() {
		const placeMoves = this.#getPlaceMovesFromPositionsForEachPieceInHand(
			ORIGIN.adjacent
		);
		return placeMoves;
	}

	#getAfterSecondTurnPlaceMoves() {
		const adjPositions = this.#getAllAdjacentPositions();
		const nonAdjToOpponent =
			this.#filterOutPosAdjToOpponentPieces(adjPositions);
		const placeMoves =
			this.#getPlaceMovesFromPositionsForEachPieceInHand(nonAdjToOpponent);
		return placeMoves;
	}

	#getAllAdjacentPositions() {
		let positions = [];
		for (const pos of this.getAllPiecePositions()) {
			for (const potentialPos of pos.adjacent) {
				if (this.findPieceAt(potentialPos) === undefined) {
					positions.push(potentialPos);
				}
			}
		}
		return positions;
	}

	#filterOutPosAdjToOpponentPieces(pos) {
		const filtered = pos.filter((pos) => {
			for (const adj of pos.adjacent) {
				const adjPiece = this.findPieceAt(adj);
				if (adjPiece !== undefined && adjPiece.color !== this.currColor) {
					return false;
				}
			}
			return true;
		});
		return filtered;
	}

	#getPlaceMovesFromPositionsForEachPieceInHand(positions) {
		let moves = [];
		this.getFirstOfEachPieceInHand().forEach((piece) => {
			for (const pos of positions) {
				moves.push(new Move(piece, pos));
			}
		});
		return moves;
	}
	

	getPlaceMoves() {
		if (this.turn === 0) return this.#getFirstTurnPlaceMoves();
		else if (this.turn === 1) return this.#getSecondTurnPlaceMoves();

		const placeMoves = this.#getAfterSecondTurnPlaceMoves();
		if (this.turn >= 6) {
			const queen = this.getQueenInHand();
			if (queen !== undefined) {
				return placeMoves.filter((move) => move.piece.type === PieceType.QUEEN);
			}
		}
		return placeMoves;
	}

	getPieceMoves(pos) {
		const piece = this.findPieceAt(pos);
		if (piece.color !== this.currColor) return [];

		if (this.turn >= 6) {
			const queen = this.getQueenInHand();
			if (queen !== undefined) {
				return [];
			}
		}

		for (const adj of pos.adjacent) {
			const adjPiece = this.findPieceAt(adj);
			if (adjPiece === undefined && !this.#isBoardConnectedAfterMove(new Move(piece, adj, pos))) {
				return [];
			}
		}

		if (piece.type === PieceType.QUEEN)
			return pos.adjacent.filter(adj => 
				(this.isPosFreeAndAdjToAnyPieceExcluding(adj, pos) &&
				this.#canSlideBetween(pos, adj)))
					.map(adj => new Move(piece, adj, pos));

		const moves = [];
		const frontier = [pos];
		const enteredFrontier = new Set();
		enteredFrontier.add(pos.toString())

		while (frontier.length > 0) {
			const current = frontier.pop();
			const potentialMove = new Move(this.findPieceAt(pos), current, pos)
			
			if (!current.equals(pos))
				moves.push(potentialMove);

			for (const adj of current.adjacent) {
				if (
					this.isPosFreeAndAdjToAnyPieceExcluding(adj, pos) &&
					!enteredFrontier.has(adj.toString()) &&
					this.#canSlideBetween(current, adj)
				) {
					frontier.push(adj);
					enteredFrontier.add(adj.toString());
				}
			}
		}

		return moves;
	}

	getAllPossibleMoves() {
		const placeMoves = this.getPlaceMoves();
		const piecePositions = this.getAllPiecePositions().filter(
		(pos) => this.findPieceAt(pos).color === this.currColor
		);

		const pieceMoves = piecePositions.flatMap((pos) => this.getPieceMoves(pos));

		const allMoves = [...placeMoves, ...pieceMoves];
		return allMoves;
	}

	minimaxAlphaBeta(depth, alpha, beta, maximizingPlayer) {
		if (depth === 0 || this.isGoalState(this.currColor) || this.isGoalState(this.opponentColor)) {
		  return { move: null, value: this.evaluateState() };
		}
	  
		let bestMove = null;
	  
		if (maximizingPlayer) {
		  let maxEval = Number.NEGATIVE_INFINITY;
		  const moves = this.getAllPossibleMoves();
		  for (const move of moves) {
			this.doMove(move);
			const evalData = this.minimaxAlphaBeta(depth - 1, alpha, beta, false);
			this.undoMove(move);
	  
			if (evalData.value > maxEval) {
			  maxEval = evalData.value;
			  bestMove = move;
			}
	  
			alpha = Math.max(alpha, evalData.value);
			if (beta <= alpha) {
			  break;
			}
		  }
		  return { move: bestMove, value: maxEval };
		} else {
		  let minEval = Number.POSITIVE_INFINITY;
		  const moves = this.getAllPossibleMoves();
		  for (const move of moves) {
			this.doMove(move);
			const evalData = this.minimaxAlphaBeta(depth - 1, alpha, beta, true);
			this.undoMove(move);
	  
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

	#canSlideBetween(from, to) {
		const fromAdjBlocked = from.adjacent.filter(pos => this.findPieceAt(pos));
		const toAdjBlocked = to.adjacent.filter(pos => this.findPieceAt(pos));
		const commonNeighbors = fromAdjBlocked.filter(fromPos => toAdjBlocked.some(toPos => fromPos.equals(toPos)));
	
		if (commonNeighbors.length >= 2) {
			return false;
		}
		return true;
	}

	#isBoardConnectedAfterMove(move) {
		//temporarily remove piece
		this.board.delete(move.prev.toString());

		const positions = this.getAllPiecePositions();
		let frontier = [positions[0]];
		let enteredFrontier = new Set();
		enteredFrontier.add(positions[0].toString());

		let connectedCount = 0;
		while (frontier.length > 0) {
			const current = frontier.pop();
			connectedCount += 1;
			
			for (const adj of current.adjacent) {
				if (this.findPieceAt(adj) && !enteredFrontier.has(adj.toString())) {
					frontier.push(adj);
					enteredFrontier.add(adj.toString());
				}
			}
		}

		console.log("connectedCount: " + connectedCount);

		this.board.set(move.prev.toString(), move.piece);

		return connectedCount === this.size - 1;
	}

	isPosFreeAndAdjToAnyPieceExcluding(pos, excluding) {
		if (this.findPieceAt(pos)) return false;

		for (const adj of pos.adjacent) {
			if (this.findPieceAt(adj) && !adj.equals(excluding)) {
				return true;
			}
    	}

    	return false;
	}

	getAllPiecePositions() {
		//convert each to HexPos.
		return Array.from(this.board.keys()).map(HexPos.fromString);
	}

	// testing utilities

	findPlaceMoveAt(pos) {
		return this.getPlaceMoves().find((move) => move.pos.equals(pos));
	}

	findAntPlaceMoveAt(pos) {
		return this.getPlaceMoves().filter(move => move.piece.type === PieceType.ANT).find((move) => move.pos.equals(pos));
	}
}

export class Piece {
	constructor(type, color) {
		this.type = type;
		this.color = color;
	}
}

export class Move {
	constructor(piece, pos, prev=null) {
		this.piece = piece;
		this.pos = pos;
		this.prev = prev;
	}

	equals(otherMove) {
		return (
			Object.is(this.piece, otherMove.piece) && this.pos.equals(otherMove.pos)
		);
	}
}

export class HexPos {
	constructor(q, r) {
		this.q = q;
		this.r = r;
	}

	static fromString(s) {
		const [q, r] = s.split(',').map(Number);
		return new HexPos(q, r);
	}

	toString() {
		return `${this.q},${this.r}`;
	}

	equals(other) {
		return this.q === other.q && this.r === other.r;
	}

	get adjacent() {
		return [
			this.topLeft,
			this.topRight,
			this.top,
			this.bot,
			this.botLeft,
			this.botRight,
		];
	}

	get top() {
		return new HexPos(this.q, this.r - 1);
	}

	get bot() {
		return new HexPos(this.q, this.r + 1);
	}

	get topLeft() {
		return new HexPos(this.q - 1, this.r);
	}

	get botRight() {
		return new HexPos(this.q + 1, this.r);
	}

	get topRight() {
		return new HexPos(this.q + 1, this.r - 1);
	}

	get botLeft() {
		return new HexPos(this.q - 1, this.r + 1);
	}
}

export const ORIGIN = new HexPos(0, 0, 0);

export const Color = {
	BLACK: 'black',
	WHITE: 'white',
};

export const PieceType = {
	QUEEN: 'queen',
	SPIDER: 'spider',
	BEETLE: 'beetle',
	GRASSHOPPER: 'grasshopper',
	ANT: 'ant',
};
