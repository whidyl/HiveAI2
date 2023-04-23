import React, { useState } from 'react';
import { HexGrid, Layout, Hexagon, Text } from 'react-hexgrid';
import HiveWorld, {
	HexPos,
	Move,
	PieceType,
	Color,
} from '../Model/HiveWorld.js';
import { RandomHiveAI } from '../Model/RandomAI.js';
import { MinMaxHiveAI } from '../Model/MinMaxAI.js';

export default function HiveGame() {
	const [hiveWorld, setHiveWorld] = useState(new HiveWorld());
	const [placeMoves, setPlaceMoves] = useState([]);
	const [pieceMoves, setPieceMoves] = useState([]);
	const [blackAnts, setBlackAnts] = useState([]);
	const [whiteAnts, setWhiteAnts] = useState([]);
	const [blackQueen, setBlackQueen] = useState();
	const [whiteQueen, setWhiteQueen] = useState();
	const [winner, setWinner] = useState(null);

	const handleMove = (move) => {
		// Update hiveWorld with the new move
		hiveWorld.doMove(move);
		const ai = new MinMaxHiveAI(hiveWorld);
		ai.playMove();
		setHiveWorld(new HiveWorld(hiveWorld));
		setPlaceMoves([]);
		setPieceMoves([]);

		let blackAnts = [];
		let whiteAnts = [];
		hiveWorld.board.forEach((piece, pos) => {
			pos = HexPos.fromString(pos);
			if (piece.type === PieceType.ANT && piece.color === Color.BLACK)
				blackAnts.push({ pos: pos, piece: piece });
			else if (piece.type === PieceType.ANT && piece.color === Color.WHITE)
				whiteAnts.push({ pos: pos, piece: piece });
			else if (piece.type === PieceType.QUEEN && piece.color === Color.WHITE)
				setWhiteQueen({ pos: pos, piece: piece });
			else if (piece.type === PieceType.QUEEN && piece.color === Color.BLACK)
				setBlackQueen({ pos: pos, piece: piece });
		});

		if (hiveWorld.isGoalState(Color.BLACK))
			setWinner(Color.BLACK);
		if (hiveWorld.isGoalState(Color.WHITE))
			setWinner(Color.WHITE);

		setBlackAnts(blackAnts);
		setWhiteAnts(whiteAnts);
	};

	const getValidPlaceMoves = (pieceType) => {
		setPieceMoves([]);
		setPlaceMoves(
			hiveWorld.getPlaceMoves().filter((move) => move.piece.type === pieceType)
		);
	};

	const getValidPieceMoves = (pos) => {
		setPlaceMoves([]);
		setPieceMoves(
			hiveWorld.getPieceMoves(pos)
		);
	};

	return (
		<div>
			<HexGrid width={1200} height={800}>
				<Layout size={{ x: 5, y: 5 }}>
					{placeMoves.map((move) => (
						<Hexagon
							style={{ fill: 'green' }}
							key={`g${move.pos.toString()}`}
							q={move.pos.q}
							r={move.pos.r}
							s={0}
							onClick={() => handleMove(move)}
						/>
					))}

					{pieceMoves.map((move) => (
						<Hexagon
							style={{ fill: 'blue' }}
							key={`b${move.pos.toString()}`}
							q={move.pos.q}
							r={move.pos.r}
							s={0}
							onClick={() => handleMove(move)}
						/>
					))}

					{blackAnts.map((move) => (
						<Hexagon
							style={{ fill: 'black' }}
							key={`blk${move.pos.toString()}`}
							q={move.pos.q}
							r={move.pos.r}
							s={0}
							onClick={() => getValidPieceMoves(move.pos)}
						>
							<Text style={{ fill: 'white', fontSize: 5 }}> Ant </Text>
						</Hexagon>
					))}

					{whiteAnts.map((move) => (
						<Hexagon
							style={{ fill: 'grey' }}
							key={`w${move.pos.toString()}`}
							q={move.pos.q}
							r={move.pos.r}
							s={0}
							onClick={() => getValidPieceMoves(move.pos)}
						>
							<Text style={{ fill: 'white', fontSize: 5 }}> Ant </Text>
						</Hexagon>
					))}
					{whiteQueen ? (
						<Hexagon
							style={{ fill: 'grey' }}
							key={`wq${whiteQueen.pos.toString()}`}
							q={whiteQueen.pos.q}
							r={whiteQueen.pos.r}
							s={0}
							onClick={() => getValidPieceMoves(whiteQueen.pos)}
						>
							<Text style={{ fill: 'gold', fontSize: 3 }}> Queen </Text>
						</Hexagon>
					) : (
						<></>
					)}

					{blackQueen ? (
						<Hexagon
							style={{ fill: 'black' }}
							key={`bq${blackQueen.pos.toString()}`}
							q={blackQueen.pos.q}
							r={blackQueen.pos.r}
							s={0}
							onClick={() => getValidPieceMoves(blackQueen.pos)}
						>
							<Text style={{ fill: 'gold', fontSize: 3 }}> Queen </Text>
						</Hexagon>
					) : (
						<></>
					)}
				</Layout>
			</HexGrid>
			<button onClick={() => getValidPlaceMoves(PieceType.ANT)}>
				Place Ant
			</button>
			<button onClick={() => getValidPlaceMoves(PieceType.QUEEN)}>
				Place Queen
			</button>
			{winner ? <h1>GAME OVER</h1> : <></>}
			<h1>{hiveWorld.evaluateState()}</h1>
		</div>
	);
}
