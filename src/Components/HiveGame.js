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
	const [blackAnts, setBlackAnts] = useState([]);
	const [whiteAnts, setWhiteAnts] = useState([]);
	const [blackQueen, setBlackQueen] = useState();
	const [whiteQueen, setWhiteQueen] = useState();

	const handleMove = (move) => {
		// Update hiveWorld with the new move
		hiveWorld.doMove(move);
		setHiveWorld(new HiveWorld(hiveWorld));
		setPlaceMoves([]);

		let blackAnts = [];
		let whiteAnts = [];
		hiveWorld.board.forEach((piece, pos) => {
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
		// Update hiveWorld with the new move
		setPlaceMoves(
			hiveWorld.getPlaceMoves().filter((move) => move.piece.type === pieceType)
		);
	};

	return (
		<div>
			<HexGrid width={1200} height={800}>
				<Layout size={{ x: 7, y: 7 }}>
					{placeMoves.map((move) => (
						<Hexagon
							style={{ fill: 'green' }}
							key={`${move.pos.q}, ${move.pos.r}`}
							q={move.pos.q}
							r={move.pos.r}
							s={0}
							onClick={() => handleMove(move)}
						/>
					))}

					{blackAnts.map((move) => (
						<Hexagon
							style={{ fill: 'black' }}
							key={`${move.pos.q}, ${move.pos.r}`}
							q={move.pos.q}
							r={move.pos.r}
							s={0}
						>
							<Text style={{ fill: 'white', fontSize: 5 }}> Ant </Text>
						</Hexagon>
					))}

					{whiteAnts.map((move) => (
						<Hexagon
							style={{ fill: 'grey' }}
							key={`${move.pos.q}, ${move.pos.r}`}
							q={move.pos.q}
							r={move.pos.r}
							s={0}
						>
							<Text style={{ fill: 'white', fontSize: 5 }}> Ant </Text>
						</Hexagon>
					))}
					{whiteQueen ? (
						<Hexagon
							style={{ fill: 'grey' }}
							key={`${whiteQueen.pos.q}, ${whiteQueen.pos.r}`}
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
							key={`${blackQueen.pos.q}, ${blackQueen.pos.r}`}
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
