import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

type Point = { x: number; y: number };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Refs for mutable game state
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirRef = useRef<Point>({ x: 0, y: -1 });
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const trailRef = useRef<(Point & { alpha: number })[]>([]);
  const gameLoopRef = useRef<number | null>(null);

  const spawnFood = (snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = { x: 0, y: -1 };
    nextDirRef.current = { x: 0, y: -1 };
    foodRef.current = spawnFood(snakeRef.current);
    trailRef.current = [];
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (!hasStarted) {
          resetGame();
        } else if (gameOver) {
          resetGame();
        } else {
          setIsPaused(p => !p);
        }
        return;
      }

      if (!hasStarted || isPaused || gameOver) return;

      const { x, y } = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) nextDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) nextDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) nextDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) nextDirRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused, hasStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw grid
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1;
      for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
      }

      // Draw Food
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ff00ff';
      ctx.fillRect(
        foodRef.current.x * CELL_SIZE + 2,
        foodRef.current.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );

      // Draw Trail
      trailRef.current.forEach(t => {
        t.alpha -= 0.15;
      });
      trailRef.current = trailRef.current.filter(t => t.alpha > 0);

      trailRef.current.forEach(t => {
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(0, 255, 255, ${t.alpha * 0.5})`;
        ctx.fillRect(
          t.x * CELL_SIZE + 1,
          t.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      });

      // Draw Snake
      ctx.shadowBlur = 0;
      snakeRef.current.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      });
    };

    const update = () => {
      if (!hasStarted || gameOver || isPaused) {
        draw();
        return;
      }

      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const newHead = {
        x: head.x + dirRef.current.x,
        y: head.y + dirRef.current.y,
      };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      snakeRef.current.unshift(newHead);

      // Food collision
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        setScore(s => s + 10);
        foodRef.current = spawnFood(snakeRef.current);
      } else {
        const popped = snakeRef.current.pop();
        if (popped) {
          trailRef.current.push({ ...popped, alpha: 1 });
        }
      }

      draw();
    };

    gameLoopRef.current = window.setInterval(update, 150);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver, isPaused, hasStarted]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between w-full max-w-[400px] mb-4 px-2">
        <div className="text-xl font-mono font-bold text-[#00ffff]">
          DATA_COLLECTED: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-sm font-mono text-[#ff00ff] mt-1 animate-pulse">
          {isPaused && !gameOver ? 'SYS.PAUSED' : ''}
        </div>
      </div>

      <div className="relative p-1 bg-[#000] border-4 border-[#00ffff] shadow-[4px_4px_0px_#ff00ff]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-[#050505]"
        />

        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-transparent border-2 border-[#00ffff] text-[#00ffff] font-bold tracking-widest hover:bg-[#ff00ff] hover:border-[#ff00ff] hover:text-black transition-colors uppercase"
            >
              [ EXECUTE ]
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-md">
            <h3 className="text-4xl font-black text-[#ff00ff] mb-2 tracking-widest glitch" data-text="FATAL_ERROR">
              FATAL_ERROR
            </h3>
            <p className="text-[#00ffff] mb-8 font-mono text-lg">
              DATA_LOST: {score}
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-[#ff00ff] text-black font-bold tracking-widest hover:bg-[#00ffff] transition-colors uppercase"
            >
              [ REBOOT_SYS ]
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#ff00ff] text-xs font-mono text-center tracking-widest uppercase opacity-70">
        INPUT: <span className="text-[#00ffff]">ARROWS/WASD</span> &bull; HALT: <span className="text-[#00ffff]">SPACE</span>
      </div>
    </div>
  );
}
