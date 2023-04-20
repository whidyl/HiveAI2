export default class HiveWorld {
	constructor(copyFrom = null) {
		if (copyFrom !== null) {
			this.blackHand = copyFrom.blackHand;
			this.whiteHand = copyFrom.whiteHand;
			this.board = copyFrom.board;
			this.turn = copyFrom.turn;
		} else {
			this.blackHand = this.#makeStartingHand(Color.BLACK);
			this.whiteHand = this.#makeStartingHand(Color.WHITE);
			this.board = new Map();
			this.turn = 0;
		}
	}

	get currColor() {
		return this.turn % 2 === 0 ? Color.BLACK : Color.WHITE;
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

	doMove(move) {
		if (move.prev)
			this.board.delete(move.prev.toString());
		else
			this.getHand(move.piece.color).delete(move.piece);
			
		this.board.set(move.pos.toString(), move.piece);
		this.turn++;
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
		if (this.findPieceAt(pos).color !== this.currColor) return [];

		for (const adj of pos.adjacent) {
			const piece = this.findPieceAt(adj);
			if (piece && !this.#isBoardConnectedAfterMove(new Move(this.findPieceAt(pos), adj, pos))) {
				return [];
			}
		}

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

		let connectedCount = 0;
		while (frontier.length > 0) {
			const current = frontier.pop();
			
			for (const adj of current.adjacent) {
				if (this.findPieceAt(adj) && !enteredFrontier.has(adj.toString())) {
					frontier.push(adj);
					enteredFrontier.add(adj.toString());
					connectedCount += 1;
				}
			}
		}

		console.log(connectedCount);

		this.board.set(move.prev.toString(), move.piece);

		return connectedCount === positions.length;
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
