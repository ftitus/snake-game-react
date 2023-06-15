import React, { useState, useEffect } from "react";
import "./App.css";

const GRID_SIZE = 20; // Grid size in pixels
const CANVAS_SIZE = 400; // Canvas size in pixels

const Direction = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

const App = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [food, setFood] = useState({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== Direction.DOWN) {
            setDirection(Direction.UP);
          }
          break;
        case "ArrowDown":
          if (direction !== Direction.UP) {
            setDirection(Direction.DOWN);
          }
          break;
        case "ArrowLeft":
          if (direction !== Direction.RIGHT) {
            setDirection(Direction.LEFT);
          }
          break;
        case "ArrowRight":
          if (direction !== Direction.LEFT) {
            setDirection(Direction.RIGHT);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [direction]);

  useEffect(() => {
    const handleGameLoop = setInterval(() => {
      if (gameOver) {
        clearInterval(handleGameLoop);
        return;
      }

      const head = { ...snake[0] };

      switch (direction) {
        case Direction.UP:
          head.y--;
          break;
        case Direction.DOWN:
          head.y++;
          break;
        case Direction.LEFT:
          head.x--;
          break;
        case Direction.RIGHT:
          head.x++;
          break;
        default:
          break;
      }

      const newSnake = [head, ...snake];
      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => prevScore + 1);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      if (
        head.x < 0 ||
        head.x >= CANVAS_SIZE / GRID_SIZE ||
        head.y < 0 ||
        head.y >= CANVAS_SIZE / GRID_SIZE ||
        isSnakeCollision(newSnake)
      ) {
        setGameOver(true);
      }

      setSnake(newSnake);
    }, 100);

    return () => {
      clearInterval(handleGameLoop);
    };
  }, [snake, direction, food, gameOver]);

  useEffect(() => {
    generateFood(snake);
  }, [snake]);

  const generateFood = (snake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
    } while (isFoodCollision(newFood, snake));

    setFood(newFood);
  };

  const isFoodCollision = (food, snake) => {
    return snake.some(
      (segment) => segment.x === food.x && segment.y === food.y
    );
  };

  const isSnakeCollision = (snake) => {
    const [head, ...body] = snake;
    return body.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const handleStartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection(Direction.RIGHT);
    setScore(0);
    setGameOver(false);
  };

  const renderSnake = () => {
    return snake.map((segment, index) => (
      <div
        key={index}
        className={`segment ${index === 0 ? "head" : ""}`}
        style={{
          left: segment.x * GRID_SIZE,
          top: segment.y * GRID_SIZE,
        }}
      ></div>
    ));
  };

  const renderFood = () => {
    return (
      <div
        className="food"
        style={{
          left: food.x * GRID_SIZE,
          top: food.y * GRID_SIZE,
        }}
      ></div>
    );
  };

  return (
    <div className="App">
      <h1 className="title">Snake</h1>
      <div className="game-container">
        {gameOver && (
          <div className="game-over">
            <p>Game Over!</p>
            <p>Your Score: {score}</p>
            <button onClick={handleStartGame}>Play Again</button>
          </div>
        )}
        {!gameOver && (
          <div>
            <div className="game-instructions">
              <p>Use arrow keys to control the snake.</p>
              <p>Eat the red food to grow.</p>
            </div>
            <div className="game-board">
              {renderSnake()}
              {renderFood()}
            </div>
            <div className="game-score">Score: {score}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
