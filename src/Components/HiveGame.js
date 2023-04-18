import React, { useState } from 'react';
import { HexGrid, Layout, Hexagon } from 'react-hexgrid';
import HiveWorld, { HexPos, Move, PieceType, Color } from '../Model/HiveWorld.js';

export default function HiveGame() {
	const [hiveWorld, setHiveWorld] = useState(new HiveWorld());
	const [validMoves, setValidMoves] = useState([]);
	const [blackAnts, setBlackAnts] = useState([]);
	const [whiteAnts, setWhiteAnts] = useState([]);

	const handleMove = (move) => {
		// Update hiveWorld with the new move
		hiveWorld.doMove(move);
		setHiveWorld(new HiveWorld(hiveWorld));
		setValidMoves([]);

		let blackAnts = [];
		let whiteAnts = [];
		hiveWorld.board.forEach((piece, pos) => {
			if(piece.type === PieceType.ANT && piece.color === Color.BLACK)
				blackAnts.push({pos: pos, piece: piece});
			if(piece.type === PieceType.ANT && piece.color === Color.WHITE)
				whiteAnts.push({pos: pos, piece: piece});
		});

		setBlackAnts(blackAnts);
		setWhiteAnts(whiteAnts);
	};

	const getValidPlaceMoves = (pieceType) => {
		// Update hiveWorld with the new move
		setValidMoves(hiveWorld.getPlaceMoves().filter(move => move.piece.type === pieceType));
	};

	return (
    <div>
      <HexGrid width={1200} height={800}>
        <Layout size={{ x: 7, y: 7 }}>
          {validMoves.map((move) => (
            <Hexagon style={{fill: "green"}} key={`${move.pos.q}, ${move.pos.r}`} q={move.pos.q} r={move.pos.r} s={0} onClick={() => handleMove(move)} />
          ))}

		 {blackAnts.map((move) => (
            <Hexagon style={{fill: "black"}} key={`${move.pos.q}, ${move.pos.r}`} q={move.pos.q} r={move.pos.r} s={0}/>
          ))}

		 {whiteAnts.map((move) => (
            <Hexagon style={{fill: "grey"}} key={`${move.pos.q}, ${move.pos.r}`} q={move.pos.q} r={move.pos.r} s={0}/>
          ))}
        </Layout>
      </HexGrid>
      <button onClick={() => getValidPlaceMoves(PieceType.ANT)}>Place Ant</button>
    </div>
	);
}
