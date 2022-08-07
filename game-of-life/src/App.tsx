import React, { useState } from "react";

const numRows = 50;
const numCols = 50;

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }

    return rows;
  });

  return ( 
    <div 
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 15px)`
      }}>
      {grid.map((rows, i) => 
        rows.map((col, k) => (
          <div 
            key={`${i}-${k}`}
            style={{
              width: 15, 
              height: 15, 
              backgroundColor: grid[i][k] ? "green" : "black",
              border: "solid 0.5px white"
            }} 
          />
        ))
      )} 
    </div>
    );
};

export default App;
