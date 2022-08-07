import produce from "immer";
import React, { useCallback, useRef, useState } from "react";

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [1, 0],
  [-1, 0],
  [-1, -1],
  [-1, 1],
]

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }

  return rows;
}

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;


  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    // Simulation Start point
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x; 
              const newK = k + y; 
              if (newI >= 0 && newK && newI < numRows && newK < numCols) {
                neighbours += g[newI][newK];
              }
            })

            // # Rules:
            //
            // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            // Any live cell with two or three live neighbours lives on to the next generation.
            // Any live cell with more than three live neighbours dies, as if by overpopulation.
            // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbours === 3) {
              gridCopy[i][k] = 1;
            }
          }
        } 
      });
    });
    // Simulation End point
    
    setTimeout(runSimulation, 200);
  }, [])

  return ( 
    <>
      <button 
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        { running ? "stop" : "start" }
      </button>

      <button onClick={() => {
        setGrid(generateEmptyGrid())
      }}> 
        clear
      </button>

      <button onClick={() => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
          rows.push(
            Array.from(Array(numCols), () => (Math.random() > .9 ? 1 : 0))
          );
        }
      
        setGrid(rows);
      }}> 
        random
      </button>

      <div 
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 15px)`
        }}>
        {grid.map((rows, i) => 
          rows.map((col, k) => (
            <div 
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0: 1;
                  });
                setGrid(newGrid);
              }}
              style={{
                width: 15, 
                height: 15, 
                backgroundColor: grid[i][k] ? "greenyellow" : "black",
                border: "solid 0.1px white"
              }} 
            />
          ))
        )} 
      </div>
    </>
    );
};

export default App;
