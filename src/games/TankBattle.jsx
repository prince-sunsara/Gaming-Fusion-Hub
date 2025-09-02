import React, { useRef, useEffect, useState } from "react";
import { Heart, RefreshCw, Dribbble, Target } from "lucide-react";

// TankBattle Game component
const TankBattle = () => {
  const canvasRef = useRef(null);
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState("");

  // Refs for core game data to avoid unnecessary re-renders
  const gameData = useRef({
    player1: {
      x: 100,
      y: 100,
      size: 40,
      angle: Math.PI / 2,
      speed: 2,
      turnSpeed: 0.05,
      projectiles: [],
      isShooting: false,
      shootCooldown: 300,
      lastShot: 0,
    },
    player2: {
      x: 600,
      y: 400,
      size: 40,
      angle: -Math.PI / 2,
      speed: 1.5,
      turnSpeed: 0.04,
      projectiles: [],
      isShooting: false,
      shootCooldown: 500,
      lastShot: 0,
    },
    walls: [],
    keys: {},
    gameRunning: true,
  });

  // Colors and styling
  const colors = {
    background: "#0f172a",
    wall: "#334155",
    player1: "#d946ef",
    player2: "#00ffff",
    projectile: "#f8fafc",
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
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { player1, player2, walls } = gameData.current;
    const now = Date.now();

    // Update player positions
    updatePlayer(player1, "player1", canvas, now);
    updatePlayer(player2, "player2", canvas, now); // Player 2 is now AI

    // Update projectiles
    updateProjectiles(player1.projectiles, player2, walls);
    updateProjectiles(player2.projectiles, player1, walls);

    // Check for game over condition
    if (player1Health <= 0) {
      setGameOver(true);
      setGameMessage("The Computer Wins!");
      gameData.current.gameRunning = false;
    }
    if (player2Health <= 0) {
      setGameOver(true);
      setGameMessage("Player 1 Wins!");
      gameData.current.gameRunning = false;
    }

    // Drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx, canvas);

    if (gameData.current.gameRunning) {
      requestAnimationFrame(gameLoop);
    }
  };

  // Function to update a single player's state (human or AI)
  const updatePlayer = (player, playerKey, canvas, now) => {
    const k = gameData.current.keys;
    let oldX = player.x;
    let oldY = player.y;

    // Human Player 1 Controls
    if (playerKey === "player1") {
      if (k.w) {
        player.x += Math.cos(player.angle) * player.speed;
        player.y += Math.sin(player.angle) * player.speed;
      }
      if (k.s) {
        player.x -= Math.cos(player.angle) * player.speed;
        player.y -= Math.sin(player.angle) * player.speed;
      }
      if (k.a) {
        player.angle -= player.turnSpeed;
      }
      if (k.d) {
        player.angle += player.turnSpeed;
      }
      if (k[" "] && now - player.lastShot > player.shootCooldown) {
        player.projectiles.push(createProjectile(player));
        player.lastShot = now;
      }
    }
    // AI Player 2 Logic
    else if (playerKey === "player2") {
      const target = gameData.current.player1;
      const dx = target.x - player.x;
      const dy = target.y - player.y;
      const targetAngle = Math.atan2(dy, dx);
      let angleDiff = targetAngle - player.angle;

      // Normalize angle difference to be between -PI and PI
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      // Turn towards the human player
      if (Math.abs(angleDiff) > player.turnSpeed) {
        player.angle += Math.sign(angleDiff) * player.turnSpeed;
      }

      // Check for impending collision with a wall and adjust course
      let collisionDetected = false;
      const checkPoint = {
        x: player.x + Math.cos(player.angle) * (player.speed + 5),
        y: player.y + Math.sin(player.angle) * (player.speed + 5),
        size: player.size,
      };

      for (const wall of gameData.current.walls) {
        if (checkCollision(checkPoint, wall)) {
          collisionDetected = true;
          break;
        }
      }

      if (collisionDetected) {
        player.angle += Math.PI / 4; // Turn by a fixed amount to avoid the wall
      } else {
        // Move forward if no collision is imminent
        player.x += Math.cos(player.angle) * player.speed;
        player.y += Math.sin(player.angle) * player.speed;
      }

      // Check for line of sight and shoot
      if (
        now - player.lastShot > player.shootCooldown &&
        lineOfSightIsClear(player, target)
      ) {
        player.projectiles.push(createProjectile(player));
        player.lastShot = now;
      }
    }

    // Wall collision
    for (const wall of gameData.current.walls) {
      if (checkCollision(player, wall)) {
        player.x = oldX;
        player.y = oldY;
        break;
      }
    }

    // Boundary collision
    if (
      player.x < 0 ||
      player.x + player.size > canvas.width ||
      player.y < 0 ||
      player.y + player.size > canvas.height
    ) {
      player.x = oldX;
      player.y = oldY;
    }
  };

  // Check if there are any walls blocking the line of sight between two objects
  const lineOfSightIsClear = (tank, target) => {
    const walls = gameData.current.walls;
    const step = 5;
    const dx = target.x - tank.x;
    const dy = target.y - tank.y;
    const distance = Math.hypot(dx, dy);

    // If the distance is too small, there's no need to check for walls
    if (distance < 1) return true;

    // Check every step along the line
    for (let i = 0; i < distance; i += step) {
      const x = tank.x + (dx / distance) * i;
      const y = tank.y + (dy / distance) * i;

      // Create a temporary object for collision check
      const checkPoint = { x: x, y: y, size: 1 };

      for (const wall of walls) {
        if (checkCollision(checkPoint, wall)) {
          return false; // A wall is in the way
        }
      }
    }
    return true; // No walls in the way
  };

  // Create a new projectile
  const createProjectile = (tank) => {
    const projectileSpeed = 8;
    return {
      x: tank.x + tank.size / 2,
      y: tank.y + tank.size / 2,
      size: 6,
      angle: tank.angle,
      speed: projectileSpeed,
    };
  };

  // Update projectiles and check for collisions
  const updateProjectiles = (projectiles, target, walls) => {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // Projectile-wall collision
      let hitWall = false;
      for (const wall of walls) {
        if (checkCollision(p, wall)) {
          projectiles.splice(i, 1);
          hitWall = true;
          break;
        }
      }
      if (hitWall) continue;

      // Projectile-target collision
      if (checkCollision(p, target)) {
        projectiles.splice(i, 1);
        if (target.size === gameData.current.player1.size) {
          setPlayer1Health((prev) => prev - 10);
        } else {
          setPlayer2Health((prev) => prev - 10);
        }
        continue;
      }

      // Remove off-screen projectiles
      const canvas = canvasRef.current;
      if (
        canvas &&
        (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height)
      ) {
        projectiles.splice(i, 1);
      }
    }
  };

  // Simple AABB (Axis-Aligned Bounding Box) collision detection
  const checkCollision = (obj1, obj2) => {
    return (
      obj1.x < obj2.x + obj2.size &&
      obj1.x + obj1.size > obj2.x &&
      obj1.y < obj2.y + obj2.size &&
      obj1.y + obj1.size > obj2.y
    );
  };

  // Drawing functions
  const draw = (ctx) => {
    drawWalls(ctx);
    drawTank(ctx, gameData.current.player1, colors.player1);
    drawTank(ctx, gameData.current.player2, colors.player2);
    drawProjectiles(ctx, gameData.current.player1.projectiles);
    drawProjectiles(ctx, gameData.current.player2.projectiles);
  };

  const drawWalls = (ctx) => {
    ctx.fillStyle = colors.wall;
    gameData.current.walls.forEach((wall) => {
      ctx.fillRect(wall.x, wall.y, wall.size, wall.size);
    });
  };

  const drawTank = (ctx, tank, color) => {
    // Draw body
    ctx.save();
    ctx.translate(tank.x + tank.size / 2, tank.y + tank.size / 2);
    ctx.rotate(tank.angle);
    ctx.fillStyle = color;
    ctx.fillRect(-tank.size / 2, -tank.size / 2, tank.size, tank.size);

    // Draw turret
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(tank.size / 4, -5, tank.size / 2, 10);
    ctx.restore();
  };

  const drawProjectiles = (ctx, projectiles) => {
    ctx.fillStyle = colors.projectile;
    projectiles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Effect hook to set up event listeners and game loop on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Generate initial walls
    if (gameData.current.walls.length === 0) {
      const walls = [];
      const wallSize = 40;
      // Outer walls
      for (let i = 0; i < canvas.width / wallSize; i++) {
        walls.push({ x: i * wallSize, y: 0, size: wallSize });
        walls.push({
          x: i * wallSize,
          y: canvas.height - wallSize,
          size: wallSize,
        });
      }
      for (let i = 1; i < canvas.height / wallSize - 1; i++) {
        walls.push({ x: 0, y: i * wallSize, size: wallSize });
        walls.push({
          x: canvas.width - wallSize,
          y: i * wallSize,
          size: wallSize,
        });
      }
      // Inner walls
      for (let i = 4; i < 15; i++) {
        walls.push({ x: 120, y: 50 + i * wallSize, size: wallSize });
      }
      for (let i = 4; i < 15; i++) {
        walls.push({
          x: canvas.width - 120 - wallSize,
          y: 50 + i * wallSize,
          size: wallSize,
        });
      }
      gameData.current.walls = walls;
    }

    const handleKeyDown = (e) => {
      gameData.current.keys[e.key] = true;
    };
    const handleKeyUp = (e) => {
      gameData.current.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Start the game loop
    const animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver]); // Rerun effect when game over state changes

  const restartGame = () => {
    setPlayer1Health(100);
    setPlayer2Health(100);
    setGameOver(false);
    setGameMessage("");

    // Reset game data
    gameData.current.player1 = {
      x: 100,
      y: 100,
      size: 40,
      angle: Math.PI / 2,
      speed: 2,
      turnSpeed: 0.05,
      projectiles: [],
      isShooting: false,
      shootCooldown: 300,
      lastShot: 0,
    };
    gameData.current.player2 = {
      x: 600,
      y: 400,
      size: 40,
      angle: -Math.PI / 2,
      speed: 1.5,
      turnSpeed: 0.04,
      projectiles: [],
      isShooting: false,
      shootCooldown: 500,
      lastShot: 0,
    };
    gameData.current.gameRunning = true;
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="game-container w-full max-w-5xl flex flex-col items-center p-8 rounded-xl border-2 border-primary bg-[#1e293b]"
        style={{
          boxShadow: `0 0 30px ${colors.primary}, 0 0 10px ${colors.accent}`,
        }}
      >
        <div className="flex flex-col items-center mb-6 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            TankBattle
          </h1>
          <div className="flex justify-between w-full max-w-2xl mt-4 text-textSecondary">
            <div className="flex flex-col items-center">
              <p
                className="text-lg font-bold"
                style={{ color: colors.player1 }}
              >
                Player 1
              </p>
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-error" />
                <span className="text-xl font-bold">{player1Health}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p
                className="text-lg font-bold"
                style={{ color: colors.player2 }}
              >
                Computer
              </p>
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-error" />
                <span className="text-xl font-bold">{player2Health}</span>
              </div>
            </div>
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
          width="800"
          height="600"
          className="border-2 rounded-md"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.background,
          }}
        ></canvas>

        <div
          className="mt-8 text-center"
          style={{ color: colors.textSecondary }}
        >
          {gameOver ? (
            <button
              onClick={restartGame}
              className="px-6 py-3 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-accent to-primary transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 mr-2 inline-block" />
              Restart Game
            </button>
          ) : (
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
              <div className="flex flex-col items-center">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: colors.player1 }}
                >
                  Player 1 Controls
                </h3>
                <p>
                  <span className="font-bold">WASD</span> to move,{" "}
                  <span className="font-bold">Space</span> to shoot.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TankBattle;
