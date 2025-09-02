import React, { useRef, useEffect, useState } from "react";
import { Heart, RefreshCw } from "lucide-react";

const SpaceDefender = () => {
  // Use a ref to access the canvas element
  const canvasRef = useRef(null);

  // State variables for UI elements
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState("");

  // Refs for core game data to avoid re-renders on every update
  const player = useRef({ x: 0, y: 0, size: 30, speed: 5, dx: 0, dy: 0 });
  const asteroids = useRef([]);
  const projectiles = useRef([]);

  // Game colors
  const colors = {
    background: "#0f172a",
    player: "#d946ef",
    asteroid: "#ef4444",
    projectile: "#00ffff",
    textPrimary: "#f8fafc",
    textSecondary: "#cbd5e1",
    primary: "#0ea5e9",
    accent: "#d946ef",
    error: "#ef4444",
  };

  // The main game loop
  const gameLoop = () => {
    if (gameOver) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return; // Guard against null canvas ref
    const ctx = canvas.getContext("2d");

    // Update player position based on its direction
    player.current.x += player.current.dx;
    player.current.y += player.current.dy;

    // Clamp player to canvas boundaries
    player.current.y = Math.max(
      0,
      Math.min(canvas.height - player.current.size, player.current.y)
    );

    // Update projectiles
    projectiles.current = projectiles.current.map((p) => ({
      ...p,
      x: p.x + 7,
    }));

    // Update asteroids and check for collisions with player and projectiles
    let newAsteroids = [];
    let newHealth = health;
    let newScore = score;

    asteroids.current.forEach((asteroid) => {
      asteroid.x -= 2; // Move asteroid

      // Check for collision with player
      if (checkCollision(player.current, asteroid)) {
        newHealth -= 10;
        if (newHealth <= 0) {
          setGameOver(true);
          setGameMessage("Game Over! The cosmos has claimed you.");
        }
        return; // Skip adding this asteroid to the new array
      }

      // Check for collisions with projectiles
      const hitProjectiles = projectiles.current.filter((p) =>
        checkCollision(p, asteroid)
      );
      if (hitProjectiles.length > 0) {
        newScore += 20;
        // Remove the projectiles that hit
        projectiles.current = projectiles.current.filter(
          (p) => !hitProjectiles.includes(p)
        );
        return; // Skip adding this asteroid to the new array
      }

      // Add asteroid back if it didn't collide and is still on screen
      if (asteroid.x > -50) {
        newAsteroids.push(asteroid);
      }
    });

    // Update state based on the new game variables
    setHealth(newHealth);
    setScore(newScore);
    asteroids.current = newAsteroids;
    projectiles.current = projectiles.current.filter((p) => p.x < canvas.width);

    // Spawn new asteroids
    if (Math.random() < 0.015) {
      asteroids.current.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 40),
        size: 40,
      });
    }

    // Drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);

    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    }
  };

  // Draw game elements on the canvas
  const draw = (ctx) => {
    // Draw player (a triangle)
    ctx.fillStyle = colors.player;
    ctx.beginPath();
    ctx.moveTo(player.current.x, player.current.y + player.current.size / 2);
    ctx.lineTo(player.current.x + player.current.size, player.current.y);
    ctx.lineTo(player.current.x, player.current.y - player.current.size / 2);
    ctx.closePath();
    ctx.fill();

    // Draw asteroids
    ctx.fillStyle = colors.asteroid;
    asteroids.current.forEach((asteroid) => {
      ctx.beginPath();
      ctx.arc(asteroid.x, asteroid.y, asteroid.size / 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw projectiles
    ctx.fillStyle = colors.projectile;
    projectiles.current.forEach((projectile) => {
      ctx.fillRect(projectile.x, projectile.y, 10, 4);
    });
  };

  // Optimized collision detection
  const checkCollision = (obj1, obj2) => {
    // Check if the objects' bounding boxes overlap
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

    // Center player on initial load
    player.current.x = 50;
    player.current.y = canvas.height / 2;

    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === "ArrowUp" || e.key === "w")
        player.current.dy = -player.current.speed;
      if (e.key === "ArrowDown" || e.key === "s")
        player.current.dy = player.current.speed;
      if (e.key === " ") {
        // Spacebar to shoot
        projectiles.current.push({
          x: player.current.x + player.current.size,
          y: player.current.y,
          size: 10,
        });
      }
    };

    const handleKeyUp = (e) => {
      if (
        e.key === "ArrowUp" ||
        e.key === "w" ||
        e.key === "ArrowDown" ||
        e.key === "s"
      ) {
        player.current.dy = 0;
      }
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
  }, [gameOver, health, score]); // Dependencies to re-run effect on state changes

  const restartGame = () => {
    setHealth(100);
    setScore(0);
    setGameOver(false);
    setGameMessage("");
    asteroids.current = [];
    projectiles.current = [];
    const canvas = canvasRef.current;
    if (canvas) {
      player.current.x = 50;
      player.current.y = canvas.height / 2;
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 text-white"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="game-container w-full max-w-4xl flex flex-col items-center p-8 rounded-xl border-2 border-primary bg-[#1e293b]"
        style={{
          boxShadow: `0 0 30px rgba(14, 165, 233, 0.5), 0 0 10px rgba(217, 70, 239, 0.3)`,
        }}
      >
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            SpaceDefender
          </h1>
          <div className="flex items-center space-x-4 mt-4 text-textSecondary">
            <span className="flex items-center space-x-1">
              <span className="text-error">❤</span>
              <span>{health}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="text-primary">$</span>
              <span>{score}</span>
            </span>
          </div>
          <p
            className="mt-4 text-center text-lg font-bold"
            style={{ color: colors.textPrimary }}
          >
            {gameMessage}
          </p>
        </div>

        <canvas
          ref={canvasRef}
          width="900"
          height="500"
          className="border-2 rounded-md"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.background,
          }}
        ></canvas>

        <div className="mt-8 text-center" style={{ color: colors.textMuted }}>
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
                <span className="font-bold">WASD</span> to move up and down.
              </p>
              <p>
                Press <span className="font-bold">Spacebar</span> to shoot!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceDefender;
