import React, { useState, useEffect, useCallback, useRef } from "react";

const HauntedManor = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  const [gameState, setGameState] = useState({
    score: 0,
    health: 100,
    fear: 0,
    gameRunning: false,
    gameOver: false,
    gameWon: false,
    currentRoom: "entrance",
  });

  // Game objects
  const player = useRef({
    x: 200,
    y: 250,
    width: 25,
    height: 35,
    speed: 3,
    flashlightOn: false,
    battery: 100,
  });

  const ghosts = useRef([]);
  const collectibles = useRef([]);
  const particles = useRef([]);
  const keys = useRef({});
  const roomLayout = useRef([]);

  // Room definitions
  const rooms = {
    entrance: { color: "#1a1a2e", danger: 0.3, items: 2 },
    library: { color: "#16213e", danger: 0.5, items: 3 },
    bedroom: { color: "#0f3460", danger: 0.7, items: 4 },
    basement: { color: "#0a2447", danger: 0.9, items: 5 },
  };

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    player.current.x = 200;
    player.current.y = 250;
    player.current.flashlightOn = false;
    player.current.battery = 100;

    ghosts.current = [];
    collectibles.current = [];
    particles.current = [];

    // Generate room layout
    roomLayout.current = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 8; j++) {
        if (Math.random() < 0.3) {
          roomLayout.current.push({
            x: i * 80,
            y: j * 60,
            width: 60,
            height: 40,
            type: "wall",
          });
        }
      }
    }

    // Spawn collectibles
    const currentRoom = rooms[gameState.currentRoom];
    for (let i = 0; i < currentRoom.items; i++) {
      collectibles.current.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 400 + 50,
        width: 15,
        height: 15,
        type: "key",
        collected: false,
        glow: Math.random() * Math.PI * 2,
      });
    }

    // Spawn ghosts
    const ghostCount = Math.floor(currentRoom.danger * 5);
    for (let i = 0; i < ghostCount; i++) {
      ghosts.current.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 400 + 50,
        width: 30,
        height: 40,
        speed: 1 + Math.random() * 2,
        direction: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        hostile: Math.random() < currentRoom.danger,
      });
    }
  }, [gameState.currentRoom]);

  // Create particle effect
  const createParticles = (x, y, color, count = 6) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 40,
        maxLife: 40,
        color: color,
        size: Math.random() * 4 + 1,
      });
    }
  };

  // Collision detection
  const checkCollision = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  // Distance calculation
  const getDistance = (obj1, obj2) => {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Game update loop
  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState.gameRunning) return;

    // Player movement
    let newX = player.current.x;
    let newY = player.current.y;

    if (keys.current["ArrowLeft"] || keys.current["a"])
      newX -= player.current.speed;
    if (keys.current["ArrowRight"] || keys.current["d"])
      newX += player.current.speed;
    if (keys.current["ArrowUp"] || keys.current["w"])
      newY -= player.current.speed;
    if (keys.current["ArrowDown"] || keys.current["s"])
      newY += player.current.speed;

    // Boundary checking
    newX = Math.max(0, Math.min(canvas.width - player.current.width, newX));
    newY = Math.max(0, Math.min(canvas.height - player.current.height, newY));

    // Wall collision
    let canMove = true;
    roomLayout.current.forEach((wall) => {
      const testPlayer = { ...player.current, x: newX, y: newY };
      if (checkCollision(testPlayer, wall)) {
        canMove = false;
      }
    });

    if (canMove) {
      player.current.x = newX;
      player.current.y = newY;
    }

    // Flashlight control
    if (keys.current["f"]) {
      if (player.current.battery > 0) {
        player.current.flashlightOn = true;
        player.current.battery -= 0.5;
      } else {
        player.current.flashlightOn = false;
      }
    } else {
      player.current.flashlightOn = false;
      if (player.current.battery < 100) {
        player.current.battery += 0.1;
      }
    }

    // Update ghosts
    ghosts.current.forEach((ghost, index) => {
      // Floating movement
      ghost.phase += 0.1;
      ghost.y += Math.sin(ghost.phase) * 0.5;

      // AI behavior
      if (ghost.hostile) {
        const distance = getDistance(player.current, ghost);

        if (distance < 100 && !player.current.flashlightOn) {
          // Chase player
          const angle = Math.atan2(
            player.current.y - ghost.y,
            player.current.x - ghost.x
          );
          ghost.x += Math.cos(angle) * ghost.speed;
          ghost.y += Math.sin(angle) * ghost.speed;
        } else if (distance < 50 && player.current.flashlightOn) {
          // Flee from flashlight
          const angle = Math.atan2(
            ghost.y - player.current.y,
            ghost.x - player.current.x
          );
          ghost.x += Math.cos(angle) * ghost.speed * 2;
          ghost.y += Math.sin(angle) * ghost.speed * 2;
        } else {
          // Random movement
          ghost.direction += (Math.random() - 0.5) * 0.2;
          ghost.x += Math.cos(ghost.direction) * ghost.speed;
          ghost.y += Math.sin(ghost.direction) * ghost.speed;
        }

        // Keep ghosts in bounds
        if (ghost.x < 0 || ghost.x > canvas.width)
          ghost.direction = Math.PI - ghost.direction;
        if (ghost.y < 0 || ghost.y > canvas.height)
          ghost.direction = -ghost.direction;

        ghost.x = Math.max(0, Math.min(canvas.width - ghost.width, ghost.x));
        ghost.y = Math.max(0, Math.min(canvas.height - ghost.height, ghost.y));

        // Check collision with player
        if (checkCollision(player.current, ghost)) {
          if (player.current.flashlightOn) {
            // Destroy ghost with flashlight
            createParticles(ghost.x, ghost.y, "#ffffff", 10);
            ghosts.current.splice(index, 1);
            setGameState((prev) => ({ ...prev, score: prev.score + 50 }));
          } else {
            // Take damage
            createParticles(player.current.x, player.current.y, "#ff0000", 8);
            setGameState((prev) => ({
              ...prev,
              health: prev.health - 10,
              fear: Math.min(prev.fear + 15, 100),
            }));
          }
        }
      }
    });

    // Update collectibles
    collectibles.current.forEach((item) => {
      if (!item.collected) {
        item.glow += 0.1;

        if (checkCollision(player.current, item)) {
          item.collected = true;
          createParticles(item.x, item.y, "#ffd700", 8);
          setGameState((prev) => ({
            ...prev,
            score: prev.score + 100,
            fear: Math.max(prev.fear - 5, 0),
          }));
        }
      }
    });

    // Update particles
    particles.current = particles.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      return particle.life > 0;
    });

    // Increase fear in darkness
    if (!player.current.flashlightOn) {
      setGameState((prev) => ({
        ...prev,
        fear: Math.min(prev.fear + 0.2, 100),
      }));
    }

    // Check win condition
    if (collectibles.current.every((item) => item.collected)) {
      setGameState((prev) => ({ ...prev, gameRunning: false, gameWon: true }));
    }

    // Check lose conditions
    if (gameState.health <= 0 || gameState.fear >= 100) {
      setGameState((prev) => ({ ...prev, gameRunning: false, gameOver: true }));
    }
  }, [gameState.gameRunning, gameState.health, gameState.fear]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas with room color
    const currentRoom = rooms[gameState.currentRoom];
    ctx.fillStyle = currentRoom.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ambient darkness
    if (!player.current.flashlightOn) {
      ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + gameState.fear * 0.005})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw walls
    roomLayout.current.forEach((wall) => {
      ctx.fillStyle = "#2d3748";
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

      ctx.strokeStyle = "#4a5568";
      ctx.lineWidth = 2;
      ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
    });

    // Draw collectibles
    collectibles.current.forEach((item) => {
      if (!item.collected) {
        const glowIntensity = 0.5 + 0.5 * Math.sin(item.glow);
        ctx.fillStyle = "#ffd700";
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.fillRect(item.x, item.y, item.width, item.height);
        ctx.shadowBlur = 0;
      }
    });

    // Draw ghosts
    ghosts.current.forEach((ghost) => {
      ctx.globalAlpha = ghost.alpha;

      if (ghost.hostile) {
        ctx.fillStyle =
          player.current.flashlightOn &&
          getDistance(player.current, ghost) < 100
            ? "#ff6b6b"
            : "#ffffff";
      } else {
        ctx.fillStyle = "#87ceeb";
      }

      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 20;

      // Draw ghost as floating oval
      ctx.beginPath();
      ctx.ellipse(
        ghost.x + ghost.width / 2,
        ghost.y + ghost.height / 2,
        ghost.width / 2,
        ghost.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });

    // Draw particles
    particles.current.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      ctx.globalAlpha = 1;
    });

    // Draw player
    ctx.fillStyle = "#0ea5e9";
    ctx.shadowColor = "#0ea5e9";
    ctx.shadowBlur = player.current.flashlightOn ? 25 : 10;
    ctx.fillRect(
      player.current.x,
      player.current.y,
      player.current.width,
      player.current.height
    );
    ctx.shadowBlur = 0;

    // Draw flashlight beam
    if (player.current.flashlightOn) {
      const gradient = ctx.createRadialGradient(
        player.current.x + player.current.width / 2,
        player.current.y + player.current.height / 2,
        0,
        player.current.x + player.current.width / 2,
        player.current.y + player.current.height / 2,
        150
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(
        player.current.x + player.current.width / 2,
        player.current.y + player.current.height / 2,
        150,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState.gameRunning) {
      gameLoopRef.current = setInterval(() => {
        updateGame();
        render();
      }, 1000 / 60);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameState.gameRunning, updateGame, render]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Start game
  const startGame = () => {
    initGame();
    setGameState((prev) => ({
      ...prev,
      score: 0,
      health: 100,
      fear: 0,
      gameRunning: true,
      gameOver: false,
      gameWon: false,
    }));
  };

  // Reset game
  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      score: 0,
      health: 100,
      fear: 0,
      gameRunning: false,
      gameOver: false,
      gameWon: false,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="relative">
        {/* Game Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="border-2 border-purple-500 rounded-lg shadow-[0_0_20px_rgba(139,69,19,0.5)]"
        />

        {/* UI Overlay */}
        <div className="absolute top-4 left-4 text-white space-y-2">
          <div className="bg-black bg-opacity-70 p-3 rounded-lg border border-purple-500">
            <div className="text-lg font-bold">Score: {gameState.score}</div>
            <div className="text-sm">
              Health:
              <div className="w-20 h-2 bg-gray-600 rounded-full inline-block ml-2">
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${gameState.health}%` }}
                />
              </div>
            </div>
            <div className="text-sm">
              Fear:
              <div className="w-20 h-2 bg-gray-600 rounded-full inline-block ml-2">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{ width: `${gameState.fear}%` }}
                />
              </div>
            </div>
            <div className="text-sm">
              Battery:
              <div className="w-20 h-2 bg-gray-600 rounded-full inline-block ml-2">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${player.current?.battery || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Game Over/Won Screen */}
        {(gameState.gameOver || gameState.gameWon) && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg">
            <div className="bg-slate-800 p-8 rounded-xl border-2 border-purple-500 text-center shadow-[0_0_30px_rgba(139,69,19,0.5)]">
              <h2 className="text-3xl font-bold text-white mb-4">
                {gameState.gameWon
                  ? "Escaped the Manor!"
                  : "The Spirits Got You!"}
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Final Score: {gameState.score}
              </p>
              <div className="space-x-4">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-[0_0_15px_rgba(139,69,19,0.3)]"
                >
                  Play Again
                </button>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!gameState.gameRunning &&
          !gameState.gameOver &&
          !gameState.gameWon && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg">
              <div className="bg-slate-800 p-8 rounded-xl border-2 border-purple-500 text-center shadow-[0_0_30px_rgba(139,69,19,0.5)]">
                <h1 className="text-4xl font-bold text-white mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Haunted Manor
                </h1>
                <p className="text-gray-300 mb-6">
                  Collect all keys while avoiding the spirits. Use your
                  flashlight to see and defend yourself!
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-[0_0_20px_rgba(139,69,19,0.4)]"
                >
                  Enter the Manor
                </button>
              </div>
            </div>
          )}
      </div>

      {/* Controls */}
      <div className="mt-6 text-center text-gray-400 space-y-1">
        <p>WASD or Arrow Keys to move</p>
        <p>Hold F to use flashlight (drains battery)</p>
      </div>
    </div>
  );
};

export default HauntedManor;
