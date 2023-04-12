import React, { useState } from 'react';
import { HexGrid, Layout, Hexagon } from 'react-hexgrid';
import HiveWorld, { HexPos, Move } from '../Model/HiveWorld.js';

export default function HiveGame() {
	const [hiveWorld, setHiveWorld] = useState(new HiveWorld());
	const [validMoves, setValidMoves] = useState([]);

	const handleMove = (move) => {
		// Update hiveWorld with the new move
		hiveWorld.doMove(move);
		setHiveWorld(new HiveWorld(hiveWorld));
		setValidMoves([]);
	};

	const getValidPlaceMoves = () => {
		// Update hiveWorld with the new move
		setValidMoves(hiveWorld.getPlaceMoves());
	};

	return (
    <div>
      <HexGrid width={1200} height={800}>
        <Layout size={{ x: 7, y: 7 }}>
          {validMoves.map((move) => (
            <Hexagon style={{fill: "green"}} key={`${move.pos.q}, ${move.pos.r}`} q={move.pos.q} r={move.pos.r} s={0} onClick={() => handleMove(move)} />
          ))}
        </Layout>
      </HexGrid>
      <button onClick={() => getValidPlaceMoves()}>Place Ant</button>
    </div>
	);
}
