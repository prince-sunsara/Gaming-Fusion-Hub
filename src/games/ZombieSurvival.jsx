import React, { useRef, useEffect, useState } from "react";
import { Heart, RefreshCw, Star, Dribbble, Target } from "lucide-react";

// Zombie Survival Game component
const ZombieSurvival = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [ammo, setAmmo] = useState(10);
  const [isReloading, setIsReloading] = useState(false);

  // Refs for core game data to avoid unnecessary re-renders
  const gameData = useRef({
    player: {
      x: 400,
      y: 300,
      size: 20,
      speed: 3,
      magazineSize: 10,
    },
    zombies: [],
    projectiles: [],
    keys: {},
    lastSpawn: 0,
    spawnRate: 1000, // milliseconds
    gameRunning: true,
  });

  // Colors and styling
  const colors = {
    background: "#1a1a1a",
    player: "#00e676",
    zombieSlow: "#ff1744",
    zombieFast: "#ff9800",
    projectile: "#b3e5fc",
    textPrimary: "#ffffff",
    textSecondary: "#b0bec5",
    primary: "#00e676",
    accent: "#ff1744",
    warning: "#ff9800",
  };

  // The main game loop
  const gameLoop = () => {
    if (gameOver) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { player, zombies, projectiles } = gameData.current;
    const now = Date.now();

    // Spawn new zombies
    if (now - gameData.current.lastSpawn > gameData.current.spawnRate) {
      zombies.push(createZombie(canvas));
      gameData.current.lastSpawn = now;
      // Increase difficulty over time
      if (gameData.current.spawnRate > 200) {
        gameData.current.spawnRate -= 10;
      }
    }

    // Update game state
    updatePlayer(player, canvas);
    updateZombies(zombies, player, canvas);
    updateProjectiles(projectiles, zombies);

    // Check for game over
    if (playerHealth <= 0) {
      setGameOver(true);
      setGameMessage("Game Over!");
      gameData.current.gameRunning = false;
    }

    // Drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);

    if (gameData.current.gameRunning) {
      requestAnimationFrame(gameLoop);
    }
  };

  // Create a new zombie at a random edge of the canvas
  const createZombie = (canvas) => {
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;
    if (edge === 0) {
      // top
      x = Math.random() * canvas.width;
      y = -10;
    } else if (edge === 1) {
      // right
      x = canvas.width + 10;
      y = Math.random() * canvas.height;
    } else if (edge === 2) {
      // bottom
      x = Math.random() * canvas.width;
      y = canvas.height + 10;
    } else {
      // left
      x = -10;
      y = Math.random() * canvas.height;
    }

    // 20% chance to spawn a fast zombie
    const isFast = Math.random() < 0.2;
    return {
      x,
      y,
      size: isFast ? 10 : 15 + Math.random() * 10,
      speed: isFast ? 1.5 + Math.random() * 0.5 : 0.5 + Math.random() * 0.5,
      type: isFast ? "fast" : "slow",
    };
  };

  // Update player position based on key presses
  const updatePlayer = (player, canvas) => {
    const { keys } = gameData.current;
    if (keys.w && player.y > 0) player.y -= player.speed;
    if (keys.s && player.y < canvas.height - player.size)
      player.y += player.speed;
    if (keys.a && player.x > 0) player.x -= player.speed;
    if (keys.d && player.x < canvas.width - player.size)
      player.x += player.speed;
  };

  // Update zombies' positions and handle collisions
  const updateZombies = (zombies, player, canvas) => {
    for (let i = zombies.length - 1; i >= 0; i--) {
      const zombie = zombies[i];
      const dx = player.x - zombie.x;
      const dy = player.y - zombie.y;
      const dist = Math.hypot(dx, dy);

      // Move zombie towards the player
      zombie.x += (dx / dist) * zombie.speed;
      zombie.y += (dy / dist) * zombie.speed;

      // Zombie-player collision
      if (dist < zombie.size / 2 + player.size / 2) {
        setPlayerHealth((prev) => Math.max(0, prev - 1));
        // Remove zombie on collision to prevent continuous damage
        zombies.splice(i, 1);
      }
    }
  };

  // Update projectile positions and check for collisions with zombies
  const updateProjectiles = (projectiles, zombies) => {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      let hitZombie = false;
      for (let j = zombies.length - 1; j >= 0; j--) {
        const zombie = zombies[j];
        const dist = Math.hypot(p.x - zombie.x, p.y - zombie.y);
        if (dist < p.size / 2 + zombie.size / 2) {
          projectiles.splice(i, 1);
          zombies.splice(j, 1);
          setScore((prev) => prev + 10);
          hitZombie = true;
          break;
        }
      }
      if (hitZombie) continue;

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

  // Drawing functions
  const draw = (ctx) => {
    drawPlayer(ctx, gameData.current.player);
    drawZombies(ctx, gameData.current.zombies);
    drawProjectiles(ctx, gameData.current.projectiles);
  };

  const drawPlayer = (ctx, player) => {
    ctx.fillStyle = colors.player;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawZombies = (ctx, zombies) => {
    zombies.forEach((z) => {
      ctx.fillStyle = z.type === "fast" ? colors.zombieFast : colors.zombieSlow;
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.size / 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawProjectiles = (ctx, projectiles) => {
    ctx.fillStyle = colors.projectile;
    projectiles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Function to handle reloading
  const reload = () => {
    if (isReloading || ammo === gameData.current.player.magazineSize) {
      return;
    }
    setIsReloading(true);
    setGameMessage("Reloading...");
    setTimeout(() => {
      setAmmo(gameData.current.player.magazineSize);
      setIsReloading(false);
      setGameMessage("");
    }, 2000); // 2-second reload time
  };

  // Effect hook to set up event listeners and game loop on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      gameData.current.keys[key] = true;
      if (key === "r") {
        reload();
      }
    };
    const handleKeyUp = (e) => {
      gameData.current.keys[e.key.toLowerCase()] = false;
    };

    // Fire projectile on mouse click
    const handleMouseClick = (e) => {
      if (isReloading) {
        setGameMessage("Cannot shoot while reloading!");
        setTimeout(() => setGameMessage(""), 1000);
        return;
      }
      if (ammo === 0) {
        setGameMessage("Out of Ammo! Press 'R' to reload.");
        return;
      }

      setAmmo((prev) => prev - 1);

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const player = gameData.current.player;

      const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

      const projectileSpeed = 8;
      const newProjectile = {
        x: player.x,
        y: player.y,
        size: 5,
        angle: angle,
        speed: projectileSpeed,
      };
      gameData.current.projectiles.push(newProjectile);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("click", handleMouseClick);

    // Start the game loop
    const animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("click", handleMouseClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, playerHealth, ammo, isReloading]); // Rerun effect when game over state, health, ammo, or reloading changes

  const restartGame = () => {
    setScore(0);
    setPlayerHealth(100);
    setGameOver(false);
    setGameMessage("");
    setAmmo(gameData.current.player.magazineSize);
    setIsReloading(false);

    // Reset game data
    gameData.current = {
      player: {
        x: 400,
        y: 300,
        size: 20,
        speed: 3,
        magazineSize: 10,
      },
      zombies: [],
      projectiles: [],
      keys: {},
      lastSpawn: 0,
      spawnRate: 1000,
      gameRunning: true,
    };
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="game-container w-full max-w-5xl flex flex-col items-center p-8 rounded-xl border-2 border-primary bg-[#2a2a2a]"
        style={{
          boxShadow: `0 0 30px ${colors.primary}, 0 0 10px ${colors.accent}`,
        }}
      >
        <div className="flex flex-col items-center mb-6 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Zombie Survival
          </h1>
          <div className="flex justify-between w-full max-w-2xl mt-4 text-textSecondary">
            <div className="flex flex-col items-center">
              <p
                className="text-lg font-bold"
                style={{ color: colors.textPrimary }}
              >
                Score
              </p>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold">{score}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p
                className="text-lg font-bold"
                style={{ color: colors.textPrimary }}
              >
                Health
              </p>
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-error" />
                <span className="text-xl font-bold">{playerHealth}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p
                className="text-lg font-bold"
                style={{ color: colors.textPrimary }}
              >
                Ammo
              </p>
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-blue-300" />
                <span className="text-xl font-bold">
                  {ammo}/{gameData.current.player.magazineSize}
                </span>
              </div>
            </div>
          </div>
          <p
            className="mt-4 text-center text-lg font-bold"
            style={{ color: colors.warning }}
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
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 items-center">
              <div className="flex flex-col items-center">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Controls
                </h3>
                <p>
                  <span className="font-bold">WASD</span> to move,{" "}
                  <span className="font-bold">Mouse Click</span> to shoot.
                </p>
              </div>
              <button
                onClick={reload}
                disabled={isReloading}
                className={`mt-4 px-6 py-3 text-lg font-semibold rounded-full text-white transition-all duration-300 transform ${
                  isReloading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-accent to-primary hover:scale-105"
                }`}
              >
                <Dribbble className="w-5 h-5 mr-2 inline-block" />
                Reload (<span className="font-bold">R</span>)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZombieSurvival;
