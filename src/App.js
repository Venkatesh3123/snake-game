import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect, useCallback } from "react";

const numRows = 15; // Number of rows
const numCols = 15; // Number of columns
const cellSize = 20; // Size of each cell in pixels

const App = () => {
  const [snake, setSnake] = useState([
    { row: numRows - 1, col: 2 },
    { row: numRows - 1, col: 1 },
    { row: numRows - 1, col: 0 },
    { row: numRows - 1, col: 4 },
    { row: numRows - 1, col: 3 },
  ]);
  const [count, setCount] = useState(0);
  const [food, setFood] = useState(generateRandomFoodPosition());
  const [direction, setDirection] = useState("right");
  const [gameOver, setGameOver] = useState(false);
  const refresh = () => {
    setGameOver(false);
    setSnake([
      { row: numRows - 1, col: 2 },
      { row: numRows - 1, col: 1 },
      { row: numRows - 1, col: 0 },
      { row: numRows - 1, col: 4 },
      { row: numRows - 1, col: 3 },
    ]);
  };

  useEffect(() => {
    if (!gameOver) {
      const moveSnake = () => {
        const newSnake = [...snake];
        let head = { ...newSnake[0] };

        switch (direction) {
          case "up":
            head.row -= 1;
            break;
          case "down":
            head.row += 1;
            break;
          case "left":
            head.col -= 1;
            break;
          case "right":
            head.col += 1;
            break;
          default:
            break;
        }

        newSnake.unshift(head);
        if (head.row === food.row && head.col === food.col) {
          // Snake ate the food
          setFood(generateRandomFoodPosition());
          setCount(count + 1);
        } else {
          newSnake.pop();
        }

        if (isCollision(newSnake)) {
          setGameOver(true);
        } else {
          setSnake(newSnake);
        }
      };
      if (snake.length <= 7) {
        const gameInterval = setInterval(moveSnake, 500); // Game loop
        return () => clearInterval(gameInterval);
      } else if ((snake.length >= 8) & (snake.length <= 10)) {
        const gameInterval = setInterval(moveSnake, 300); // Game loop
        return () => clearInterval(gameInterval);
      } else if ((snake.length >= 11) & (snake.length <= 13)) {
        const gameInterval = setInterval(moveSnake, 200); // Game loop
        return () => clearInterval(gameInterval);
      } else {
        const gameInterval = setInterval(moveSnake, 100); // Game loop
        return () => clearInterval(gameInterval);
      }
    }
  }, [snake, direction, food, gameOver]);

  const handleKeyPress = useCallback(
    (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "down") setDirection("up");
          break;
        case "ArrowDown":
          if (direction !== "up") setDirection("down");
          break;
        case "ArrowLeft":
          if (direction !== "right") setDirection("left");
          break;
        case "ArrowRight":
          if (direction !== "left") setDirection("right");
          break;
        default:
          break;
      }
    },
    [direction]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const isSnake = snake.some(
          (segment) => segment.row === row && segment.col === col
        );
        const isFood = food.row === row && food.col === col;

        board.push(
          <div className="main">
            <div
              key={`${row}-${col}`}
              className={`cell ${isSnake ? "snake" : ""} ${
                isFood ? "food" : ""
              } `}
              style={{
                width: cellSize,
                height: cellSize,
              }}
            ></div>
          </div>
        );
      }
    }
    return board;
  };

  return (
    <>
      <div className="mainContainer">
        <div className={`App ${gameOver ? "game-over" : ""}`}>
          <div
            className="game-board"
            style={{ gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)` }}
          >
            {renderBoard()}
          </div>
        </div>
        <button onClick={refresh} className="button">
          Play Again
        </button>
        {gameOver ? (
          <>
            <h1 className="h1">Game Over</h1>
            <br></br>
            <h3 className="h1">YOUR SCORE: {count}</h3>
          </>
        ) : (
          <>
            <h1 className="h1">Snake Game</h1>
            <br></br>
            <h3 className="h1">YOUR SCORE: {count}</h3>
          </>
        )}
      </div>
    </>
  );
};

const generateRandomFoodPosition = () => {
  return {
    row: Math.floor(Math.random() * numRows),
    col: Math.floor(Math.random() * numCols),
  };
};

const isCollision = (snake) => {
  const head = snake[0];
  return (
    head.row < 0 ||
    head.row >= numRows ||
    head.col < 0 ||
    head.col >= numCols ||
    snake
      .slice(1)
      .some((segment) => segment.row === head.row && segment.col === head.col)
  );
};

export default App;
