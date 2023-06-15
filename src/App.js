import React, { useState, useEffect } from 'react';
import './App.css';

const GRID_SIZE = 20; // Grid size in pixels
const CANVAS_SIZE = 400; // Canvas size in pixels

const Direction = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
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
        case 'ArrowUp':
          if (direction !== Direction.DOWN) {
            setDirection(Direction.UP);
          }
          break;
        case 'ArrowDown':
          if (direction !== Direction.UP) {
            setDirection(Direction.DOWN);
          }
          break;
        case 'ArrowLeft':
          if (direction !== Direction.RIGHT) {
            setDirection(Direction.LEFT);
          }
          break;
        case 'ArrowRight':
          if (direction !== Direction.LEFT) {
            setDirection(Direction.RIGHT);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction]);

  useEffect(() => {
    const handleGameLoop = setInterval(() => {
      if (gameOver) {
        clearInterval(handleGameLoop);
        return;
      }

      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case Direction.UP:
          head.y = (head.y - 1 + CANVAS_SIZE / GRID_SIZE) % (CANVAS_SIZE / GRID_SIZE);
          break;
        case Direction.DOWN:
          head.y = (head.y + 1) % (CANVAS_SIZE / GRID_SIZE);
          break;
        case Direction.LEFT:
          head.x = (head.x - 1 + CANVAS_SIZE / GRID_SIZE) % (CANVAS_SIZE / GRID_SIZE);
          break;
        case Direction.RIGHT:
          head.x = (head.x + 1) % (CANVAS_SIZE / GRID_SIZE);
          break;
        default:
          break;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => prevScore + 1);
        generateFood(newSnake);
      } else {

