import React from 'react'
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';

export default function HiveGame() {
  return (
    <div data-testid="hand-container">
      <div data-testid="hand-piece-ant">
      <HexGrid >
          <Layout size={{ x: 7, y: 7 }} flat={true} spacing={1.1} origin={{ x: 0, y: 0 }}>
            <Hexagon q={0} r={0} s={0}>
             
            </Hexagon>
          </Layout>
        </HexGrid>
        </div>
    </div>
  )
}
