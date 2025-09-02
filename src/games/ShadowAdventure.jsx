import React, { useRef, useEffect, useState } from "react";
import { Gamepad2, Heart, RefreshCw } from "lucide-react";

// React component for the 2D game
const ShadowAdventure = () => {
  // Ref to access the canvas element
  const canvasRef = useRef(null);

  // State variables for game data
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState("");

  // Player and game variables
  const TILE_SIZE = 40;
  const player = useRef({
    x: 100,
    y: 0,
    size: TILE_SIZE,
    dx: 0,
    dy: 0,
    speed: 5,
  });
  const obstacles = useRef([]);
  const items = useRef([]);

  // Game colors (replicated from the HTML theme)
  const colors = {
    player: "#d946ef",
    obstacle: "#ef4444",
    item: "#00ffff",
    background: "#0f172a",
    primary: "#0ea5e9",
    accent: "#d946ef",
    error: "#ef4444",
    textPrimary: "#f8fafc",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
  };

  // The main game loop function
  const gameLoop = () => {
    if (gameOver) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Update player position
    player.current.x += player.current.dx;
    player.current.y += player.current.dy;

    // Clamp player to canvas boundaries
    if (player.current.x < 0) player.current.x = 0;
    if (player.current.x + player.current.size > canvas.width)
      player.current.x = canvas.width - player.current.size;
    if (player.current.y < 0) player.current.y = 0;
    if (player.current.y + player.current.size > canvas.height)
      player.current.y = canvas.height - player.current.size;

    // Update obstacles and check for collisions
    obstacles.current.forEach((obstacle, index) => {
      obstacle.x -= 3;
      if (checkCollision(player.current, obstacle)) {
        setHealth((prevHealth) => {
          const newHealth = prevHealth - 10;
          if (newHealth <= 0) {
            setGameOver(true);
            setGameMessage("Game Over! You were overwhelmed.");
          }
          return newHealth;
        });
        player.current.x = 100; // Reset player position
      }
    });

    // Update items and check for collisions
    items.current.forEach((item, index) => {
      item.x -= 2;
      if (checkCollision(player.current, item)) {
        setScore((prevScore) => prevScore + 10);
        items.current.splice(index, 1);
      }
    });

    // Remove off-screen elements
    obstacles.current = obstacles.current.filter(
      (obstacle) => obstacle.x + obstacle.size > 0
    );
    items.current = items.current.filter((item) => item.x + item.size > 0);

    // Spawn new obstacles and items
    if (Math.random() < 0.02) {
      obstacles.current.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - TILE_SIZE),
        size: TILE_SIZE,
      });
    }
    if (Math.random() < 0.01) {
      items.current.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - TILE_SIZE),
        size: TILE_SIZE / 2,
      });
    }

    // Drawing functions
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    draw();

    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    }
  };

  // Draw game elements
  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");

    // Draw player
    ctx.fillStyle = colors.player;
    ctx.fillRect(
      player.current.x,
      player.current.y,
      player.current.size,
      player.current.size
    );

    // Draw obstacles
    ctx.fillStyle = colors.obstacle;
    obstacles.current.forEach((obstacle) => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });

    // Draw items
    ctx.fillStyle = colors.item;
    items.current.forEach((item) => {
      ctx.beginPath();
      ctx.arc(
        item.x + item.size / 2,
        item.y + item.size / 2,
        item.size / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  };

  // Simple AABB collision detection
  const checkCollision = (obj1, obj2) => {
    return (
      obj1.x < obj2.x + obj2.size &&
      obj1.x + obj1.size > obj2.x &&
      obj1.y < obj2.y + obj2.size &&
      obj1.y + obj1.size > obj2.y
    );
  };

  // Effect hook to set up the game and input handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    player.current.y = canvas.height / 2 - player.current.size / 2;
    setGameMessage("");

    // Keyboard input handling
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === "ArrowRight" || e.key === "d")
        player.current.dx = player.current.speed;
      if (e.key === "ArrowLeft" || e.key === "a")
        player.current.dx = -player.current.speed;
      if (e.key === "ArrowUp" || e.key === "w")
        player.current.dy = -player.current.speed;
      if (e.key === "ArrowDown" || e.key === "s")
        player.current.dy = player.current.speed;
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowRight" || e.key === "d") player.current.dx = 0;
      if (e.key === "ArrowLeft" || e.key === "a") player.current.dx = 0;
      if (e.key === "ArrowUp" || e.key === "w") player.current.dy = 0;
      if (e.key === "ArrowDown" || e.key === "s") player.current.dy = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Start the game loop
    const animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup function to remove event listeners and stop the loop
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver]); // Rerun effect when gameOver state changes to start/stop the loop

  const restartGame = () => {
    setHealth(100);
    setScore(0);
    setGameOver(false);
    player.current.x = 100;
    player.current.y = canvasRef.current.height / 2 - player.current.size / 2;
    obstacles.current = [];
    items.current = [];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 text-white bg-background">
      <div
        className="game-container w-full max-w-3xl flex flex-col items-center p-8 rounded-xl border-2 border-[#38bdf8] bg-[#1e293b]"
        style={{
          boxShadow: `0 0 30px rgba(14, 165, 233, 0.5), 0 0 10px rgba(217, 70, 239, 0.3)`,
        }}
      >
        {/* Game Title and UI */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#d946ef]">
            ShadowAdventure 2D
          </h1>
          <div className="flex items-center space-x-4 mt-4">
            <span className="text-lg font-semibold text-[#cbd5e1] flex items-center">
              <Heart className="w-5 h-5 text-error mr-1" />
              {health}
            </span>
            <span className="text-lg font-semibold text-[#cbd5e1]">
              <span className="text-primary">$</span>
              {score}
            </span>
          </div>
          <p className="mt-4 text-center text-lg text-[#f8fafc] font-bold">
            {gameMessage}
          </p>
        </div>

        {/* Game Canvas */}
        <canvas
          ref={canvasRef}
          width="800"
          height="400"
          className="border-2 rounded-md"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        ></canvas>

        {/* Instructions & Restart */}
        <div className="mt-8 text-center text-[#94a3b8] text-sm">
          {gameOver ? (
            <button
              onClick={restartGame}
              className="px-6 py-3 text-lg font-semibold rounded-full text-white
                    bg-gradient-to-r from-accent to-primary
                    transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 mr-2 inline-block" />
              Restart Game
            </button>
          ) : (
            <>
              <p>
                Use the <span className="font-bold">Arrow Keys</span> or{" "}
                <span className="font-bold">WASD</span> to move.
              </p>
              <p>
                Collect the{" "}
                <span className="text-[#00ffff] font-bold">Cyan</span> circles
                to increase your score and avoid the{" "}
                <span className="text-[#ef4444] font-bold">Red</span> squares!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShadowAdventure;
