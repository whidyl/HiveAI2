import React, { useState } from 'react';
import { HexGrid, Layout, Hexagon, Text } from 'react-hexgrid';
import HiveWorld, {
	HexPos,
	Move,
	PieceType,
	Color,
} from '../Model/HiveWorld.js';

export default function HiveGame() {
	const [hiveWorld, setHiveWorld] = useState(new HiveWorld());
	const [placeMoves, setPlaceMoves] = useState([]);
	const [pieceMoves, setPieceMoves] = useState([]);
	const [blackAnts, setBlackAnts] = useState([]);
	const [whiteAnts, setWhiteAnts] = useState([]);
	const [blackQueen, setBlackQueen] = useState();
	const [whiteQueen, setWhiteQueen] = useState();

	const handleMove = (move) => {
		// Update hiveWorld with the new move
		hiveWorld.doMove(move);
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
				<Layout size={{ x: 7, y: 7 }}>
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
						>
							<Text style={{ fill: 'white', fontSize: 4 }}> Queen </Text>
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
						>
							<Text style={{ fill: 'white', fontSize: 4 }}> Queen </Text>
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
		</div>
	);
}
