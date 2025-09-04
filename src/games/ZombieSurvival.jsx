import React, { useState, useEffect, useCallback, useRef } from "react";

const ZombieSurvival = ({ isPlaying, isPaused, onGameStateChange }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  const [internalGameState, setInternalGameState] = useState({
    score: 0,
    lives: 3,
    level: 1,
    gameRunning: false,
    gameOver: false,
    gameWon: false,
  });

  // Game objects
  const player = useRef({
    x: 400,
    y: 250,
    width: 30,
    height: 30,
    speed: 4,
    health: 100,
    maxHealth: 100,
    ammo: 30,
    maxAmmo: 30,
  });

  const zombies = useRef([]);
  const bullets = useRef([]);
  const barricades = useRef([]);
  const supplies = useRef([]);
  const bloodSplatters = useRef([]);

  const keys = useRef({});
  const gameTimer = useRef(0);
  const shootCooldown = useRef(0);
  const waveTimer = useRef(0);
  const currentWave = useRef(1);
  const zombiesKilled = useRef(0);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset player
    player.current = {
      x: 400,
      y: 250,
      width: 30,
      height: 30,
      speed: 4,
      health: 100,
      maxHealth: 100,
      ammo: 30,
      maxAmmo: 30,
    };

    // Create barricades around the map
    barricades.current = [
      { x: 150, y: 100, width: 100, height: 20, health: 3, maxHealth: 3 },
      { x: 550, y: 100, width: 100, height: 20, health: 3, maxHealth: 3 },
      { x: 100, y: 200, width: 20, height: 100, health: 3, maxHealth: 3 },
      { x: 680, y: 200, width: 20, height: 100, health: 3, maxHealth: 3 },
      { x: 150, y: 380, width: 100, height: 20, health: 3, maxHealth: 3 },
      { x: 550, y: 380, width: 100, height: 20, health: 3, maxHealth: 3 },
      { x: 350, y: 150, width: 100, height: 20, health: 4, maxHealth: 4 },
      { x: 350, y: 330, width: 100, height: 20, health: 4, maxHealth: 4 },
    ];

    // Create initial supplies
    supplies.current = [
      {
        x: 200,
        y: 200,
        width: 20,
        height: 20,
        type: "health",
        collected: false,
      },
      { x: 600, y: 300, width: 20, height: 20, type: "ammo", collected: false },
    ];

    // Clear arrays
    zombies.current = [];
    bullets.current = [];
    bloodSplatters.current = [];

    gameTimer.current = 0;
    shootCooldown.current = 0;
    waveTimer.current = 0;
    currentWave.current = 1;
    zombiesKilled.current = 0;
  }, []);

  // Collision detection
  const checkCollision = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  // Spawn zombie
  const spawnZombie = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const side = Math.floor(Math.random() * 4);
    let x, y;

    switch (side) {
      case 0: // Top
        x = Math.random() * canvas.width;
        y = -30;
        break;
      case 1: // Right
        x = canvas.width + 30;
        y = Math.random() * canvas.height;
        break;
      case 2: // Bottom
        x = Math.random() * canvas.width;
        y = canvas.height + 30;
        break;
      case 3: // Left
        x = -30;
        y = Math.random() * canvas.height;
        break;
    }

    const zombieTypes = [
      { speed: 1, health: 2, size: 25, color: "#2d5016", points: 10 },
      { speed: 1.5, health: 1, size: 20, color: "#4a4a4a", points: 15 },
      { speed: 0.8, health: 4, size: 35, color: "#8B0000", points: 25 },
    ];

    const type = zombieTypes[Math.floor(Math.random() * zombieTypes.length)];

    zombies.current.push({
      x: x,
      y: y,
      width: type.size,
      height: type.size,
      speed: type.speed + Math.random() * 0.5,
      health: type.health,
      maxHealth: type.health,
      color: type.color,
      points: type.points,
      stunned: 0,
    });
  };

  // Create blood splatter
  const createBloodSplatter = (x, y) => {
    bloodSplatters.current.push({
      x: x + Math.random() * 20 - 10,
      y: y + Math.random() * 20 - 10,
      size: Math.random() * 8 + 4,
      life: 300 + Math.random() * 200,
    });
  };

  // Game update loop
  const updateGame = useCallback(() => {
    if (!internalGameState.gameRunning) return;

    gameTimer.current++;
    waveTimer.current++;
    if (shootCooldown.current > 0) shootCooldown.current--;

    // Handle player movement
    const oldX = player.current.x;
    const oldY = player.current.y;

    if (keys.current["ArrowLeft"] && player.current.x > 0) {
      player.current.x -= player.current.speed;
    }
    if (
      keys.current["ArrowRight"] &&
      player.current.x < 800 - player.current.width
    ) {
      player.current.x += player.current.speed;
    }
    if (keys.current["ArrowUp"] && player.current.y > 0) {
      player.current.y -= player.current.speed;
    }
    if (
      keys.current["ArrowDown"] &&
      player.current.y < 500 - player.current.height
    ) {
      player.current.y += player.current.speed;
    }

    // Check collision with barricades
    for (let barricade of barricades.current) {
      if (checkCollision(player.current, barricade)) {
        player.current.x = oldX;
        player.current.y = oldY;
        break;
      }
    }

    // Shooting
    if (
      keys.current[" "] &&
      shootCooldown.current <= 0 &&
      player.current.ammo > 0
    ) {
      // Find nearest zombie for auto-aim
      let nearestZombie = null;
      let nearestDistance = Infinity;

      zombies.current.forEach((zombie) => {
        const distance = Math.sqrt(
          Math.pow(zombie.x - player.current.x, 2) +
            Math.pow(zombie.y - player.current.y, 2)
        );
        if (distance < nearestDistance && distance < 200) {
          nearestDistance = distance;
          nearestZombie = zombie;
        }
      });

      if (nearestZombie) {
        const angle = Math.atan2(
          nearestZombie.y - player.current.y,
          nearestZombie.x - player.current.x
        );

        bullets.current.push({
          x: player.current.x + player.current.width / 2,
          y: player.current.y + player.current.height / 2,
          dx: Math.cos(angle) * 8,
          dy: Math.sin(angle) * 8,
          width: 4,
          height: 4,
        });

        player.current.ammo--;
        shootCooldown.current = 15;
      }
    }

    // Spawn zombies based on wave
    const spawnRate = Math.max(120 - currentWave.current * 10, 30);
    if (
      waveTimer.current % spawnRate === 0 &&
      zombies.current.length < currentWave.current * 3 + 5
    ) {
      spawnZombie();
    }

    // Update zombies
    zombies.current.forEach((zombie, zombieIndex) => {
      if (zombie.stunned > 0) {
        zombie.stunned--;
        return;
      }

      // Move towards player
      const dx = player.current.x - zombie.x;
      const dy = player.current.y - zombie.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        zombie.x += (dx / distance) * zombie.speed;
        zombie.y += (dy / distance) * zombie.speed;
      }

      // Check collision with player
      if (checkCollision(zombie, player.current)) {
        createBloodSplatter(player.current.x, player.current.y);
        player.current.health -= 10;
        zombie.stunned = 60; // Stun zombie briefly after attack

        if (player.current.health <= 0) {
          setInternalGameState((prev) => {
            const newLives = prev.lives - 1;
            const newState = {
              ...prev,
              lives: newLives,
              gameOver: newLives <= 0,
            };
            onGameStateChange?.(newState);
            return newState;
          });

          // Reset player
          player.current.health = 100;
          player.current.x = 400;
          player.current.y = 250;
        }
      }

      // Check collision with barricades
      barricades.current.forEach((barricade) => {
        if (checkCollision(zombie, barricade)) {
          barricade.health -= 0.1;
          zombie.x -= (dx / distance) * zombie.speed * 2; // Push back
          zombie.y -= (dy / distance) * zombie.speed * 2;

          if (barricade.health <= 0) {
            const index = barricades.current.indexOf(barricade);
            if (index > -1) {
              barricades.current.splice(index, 1);
            }
          }
        }
      });
    });

    // Update bullets
    bullets.current.forEach((bullet, bulletIndex) => {
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;

      // Remove bullets that go off screen
      if (bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 500) {
        bullets.current.splice(bulletIndex, 1);
        return;
      }

      // Check collision with zombies
      zombies.current.forEach((zombie, zombieIndex) => {
        if (checkCollision(bullet, zombie)) {
          bullets.current.splice(bulletIndex, 1);
          zombie.health--;
          createBloodSplatter(zombie.x, zombie.y);

          if (zombie.health <= 0) {
            createBloodSplatter(
              zombie.x + zombie.width / 2,
              zombie.y + zombie.height / 2
            );
            zombiesKilled.current++;

            setInternalGameState((prev) => {
              const newState = { ...prev, score: prev.score + zombie.points };
              onGameStateChange?.(newState);
              return newState;
            });

            zombies.current.splice(zombieIndex, 1);

            // Chance to drop supplies
            if (Math.random() < 0.15) {
              supplies.current.push({
                x: zombie.x,
                y: zombie.y,
                width: 20,
                height: 20,
                type: Math.random() > 0.5 ? "health" : "ammo",
                collected: false,
              });
            }
          }
        }
      });

      // Check collision with barricades
      barricades.current.forEach((barricade) => {
        if (checkCollision(bullet, barricade)) {
          bullets.current.splice(bulletIndex, 1);
        }
      });
    });

    // Check supply collection
    supplies.current.forEach((supply, index) => {
      if (!supply.collected && checkCollision(player.current, supply)) {
        supply.collected = true;

        if (supply.type === "health") {
          player.current.health = Math.min(
            player.current.health + 30,
            player.current.maxHealth
          );
        } else if (supply.type === "ammo") {
          player.current.ammo = Math.min(
            player.current.ammo + 15,
            player.current.maxAmmo
          );
        }

        setInternalGameState((prev) => {
          const newState = { ...prev, score: prev.score + 5 };
          onGameStateChange?.(newState);
          return newState;
        });
      }
    });

    // Update blood splatters
    bloodSplatters.current.forEach((splatter, index) => {
      splatter.life--;
      if (splatter.life <= 0) {
        bloodSplatters.current.splice(index, 1);
      }
    });

    // Wave progression
    if (zombiesKilled.current >= currentWave.current * 5) {
      currentWave.current++;
      zombiesKilled.current = 0;
      waveTimer.current = 0;

      setInternalGameState((prev) => {
        const newState = {
          ...prev,
          level: currentWave.current,
          score: prev.score + 100,
        };
        onGameStateChange?.(newState);
        return newState;
      });

      // Add supplies between waves
      supplies.current.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 400 + 50,
        width: 20,
        height: 20,
        type: "health",
        collected: false,
      });
    }
  }, [internalGameState.gameRunning, onGameStateChange]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear with dark post-apocalyptic background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#2c3e50");
    gradient.addColorStop(1, "#34495e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw blood splatters
    bloodSplatters.current.forEach((splatter) => {
      ctx.globalAlpha = splatter.life / 300;
      ctx.fillStyle = "#8B0000";
      ctx.beginPath();
      ctx.arc(splatter.x, splatter.y, splatter.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw barricades
    barricades.current.forEach((barricade) => {
      const healthPercent = barricade.health / barricade.maxHealth;
      ctx.fillStyle = `rgb(${101 + 100 * healthPercent}, ${
        67 + 80 * healthPercent
      }, ${33 + 60 * healthPercent})`;
      ctx.fillRect(barricade.x, barricade.y, barricade.width, barricade.height);

      ctx.strokeStyle = "#2c3e50";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        barricade.x,
        barricade.y,
        barricade.width,
        barricade.height
      );

      // Damage cracks
      if (healthPercent < 0.7) {
        ctx.strokeStyle = "#34495e";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(barricade.x + 5, barricade.y + 5);
        ctx.lineTo(
          barricade.x + barricade.width - 5,
          barricade.y + barricade.height - 5
        );
        ctx.stroke();
      }
    });

    // Draw supplies
    supplies.current.forEach((supply) => {
      if (supply.collected) return;

      const color = supply.type === "health" ? "#e74c3c" : "#f39c12";
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fillRect(supply.x, supply.y, supply.width, supply.height);

      // Supply symbol
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.shadowBlur = 0;
      const symbol = supply.type === "health" ? "+" : "A";
      ctx.fillText(
        symbol,
        supply.x + supply.width / 2,
        supply.y + supply.height / 2 + 4
      );
    });

    // Draw zombies
    zombies.current.forEach((zombie) => {
      ctx.fillStyle = zombie.color;
      if (zombie.stunned > 0) {
        ctx.globalAlpha = 0.7;
      }
      ctx.shadowColor = zombie.color;
      ctx.shadowBlur = 8;
      ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);

      // Zombie eyes
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(zombie.x + 5, zombie.y + 5, 4, 4);
      ctx.fillRect(zombie.x + zombie.width - 9, zombie.y + 5, 4, 4);

      // Health bar for damaged zombies
      if (zombie.health < zombie.maxHealth) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#333";
        ctx.fillRect(zombie.x, zombie.y - 8, zombie.width, 3);
        ctx.fillStyle = "#e74c3c";
        ctx.fillRect(
          zombie.x,
          zombie.y - 8,
          (zombie.health / zombie.maxHealth) * zombie.width,
          3
        );
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    });

    // Draw player
    ctx.fillStyle = "#3498db";
    ctx.shadowColor = "#3498db";
    ctx.shadowBlur = 12;
    ctx.fillRect(
      player.current.x,
      player.current.y,
      player.current.width,
      player.current.height
    );

    // Player details
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.current.x + 8, player.current.y + 5, 6, 6); // Head
    ctx.fillRect(player.current.x + 5, player.current.y + 15, 12, 8); // Body
    ctx.shadowBlur = 0;

    // Draw bullets
    bullets.current.forEach((bullet) => {
      ctx.fillStyle = "#ffff00";
      ctx.shadowColor = "#ffff00";
      ctx.shadowBlur = 8;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });

    // Draw HUD
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(10, 10, 220, 150);
    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 220, 150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Wave: ${currentWave.current}`, 20, 30);
    ctx.fillText(`Zombies: ${zombies.current.length}`, 20, 50);
    ctx.fillText(
      `Killed: ${zombiesKilled.current}/${currentWave.current * 5}`,
      20,
      70
    );
    ctx.fillText(`Health: ${player.current.health}%`, 20, 90);
    ctx.fillText(
      `Ammo: ${player.current.ammo}/${player.current.maxAmmo}`,
      20,
      110
    );

    // Health bar
    ctx.fillStyle = "#333";
    ctx.fillRect(20, 120, 180, 8);
    const healthPercent = player.current.health / player.current.maxHealth;
    ctx.fillStyle =
      healthPercent > 0.5
        ? "#27ae60"
        : healthPercent > 0.25
        ? "#f39c12"
        : "#e74c3c";
    ctx.fillRect(20, 120, healthPercent * 180, 8);

    // Ammo bar
    ctx.fillStyle = "#333";
    ctx.fillRect(20, 135, 180, 8);
    const ammoPercent = player.current.ammo / player.current.maxAmmo;
    ctx.fillStyle = ammoPercent > 0.3 ? "#f39c12" : "#e74c3c";
    ctx.fillRect(20, 135, ammoPercent * 180, 8);

    // Wave completion indicator
    if (
      zombies.current.length === 0 &&
      zombiesKilled.current < currentWave.current * 5
    ) {
      ctx.fillStyle = "rgba(52, 152, 219, 0.8)";
      ctx.fillRect(300, 200, 200, 60);
      ctx.strokeStyle = "#3498db";
      ctx.strokeRect(300, 200, 200, 60);

      ctx.fillStyle = "#ffffff";
      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("WAVE INCOMING...", 400, 235);
    }
  }, [internalGameState.gameRunning]);

  // Handle parent control changes
  useEffect(() => {
    if (isPlaying && !isPaused) {
      if (
        !internalGameState.gameRunning &&
        !internalGameState.gameOver &&
        !internalGameState.gameWon
      ) {
        initGame();
        setInternalGameState({
          score: 0,
          lives: 3,
          level: 1,
          gameRunning: true,
          gameOver: false,
          gameWon: false,
        });
      } else if (!internalGameState.gameRunning && internalGameState.gameOver) {
        initGame();
        setInternalGameState({
          score: 0,
          lives: 3,
          level: 1,
          gameRunning: true,
          gameOver: false,
          gameWon: false,
        });
      } else {
        setInternalGameState((prev) => ({ ...prev, gameRunning: true }));
      }
    } else {
      setInternalGameState((prev) => ({ ...prev, gameRunning: false }));
    }
  }, [
    isPlaying,
    isPaused,
    initGame,
    internalGameState.gameOver,
    internalGameState.gameWon,
    internalGameState.gameRunning,
  ]);

  // Game loop
  useEffect(() => {
    if (internalGameState.gameRunning && !isPaused) {
      gameLoopRef.current = setInterval(() => {
        updateGame();
        render();
      }, 1000 / 60);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [internalGameState.gameRunning, isPaused, updateGame, render]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      if (e.key === " ") {
        e.preventDefault();
      }
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="max-w-full max-h-full border-2 border-red-500 rounded-lg shadow-lg touch-none"
        style={{
          boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
          background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        }}
      />

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 md:hidden mt-4">
        <button
          onTouchStart={() => (keys.current["ArrowLeft"] = true)}
          onTouchEnd={() => (keys.current["ArrowLeft"] = false)}
          onMouseDown={() => (keys.current["ArrowLeft"] = true)}
          onMouseUp={() => (keys.current["ArrowLeft"] = false)}
          className="px-3 py-3 bg-red-600 text-white rounded font-semibold active:bg-red-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          ←
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowUp"] = true)}
          onTouchEnd={() => (keys.current["ArrowUp"] = false)}
          onMouseDown={() => (keys.current["ArrowUp"] = true)}
          onMouseUp={() => (keys.current["ArrowUp"] = false)}
          className="px-3 py-3 bg-red-600 text-white rounded font-semibold active:bg-red-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          ↑
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowRight"] = true)}
          onTouchEnd={() => (keys.current["ArrowRight"] = false)}
          onMouseDown={() => (keys.current["ArrowRight"] = true)}
          onMouseUp={() => (keys.current["ArrowRight"] = false)}
          className="px-3 py-3 bg-red-600 text-white rounded font-semibold active:bg-red-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          →
        </button>
        <div></div>
        <button
          onTouchStart={() => (keys.current["ArrowDown"] = true)}
          onTouchEnd={() => (keys.current["ArrowDown"] = false)}
          onMouseDown={() => (keys.current["ArrowDown"] = true)}
          onMouseUp={() => (keys.current["ArrowDown"] = false)}
          className="px-3 py-3 bg-red-600 text-white rounded font-semibold active:bg-red-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          ↓
        </button>
        <div></div>
        <div className="col-span-3 mt-2">
          <button
            onTouchStart={() => (keys.current[" "] = true)}
            onTouchEnd={() => (keys.current[" "] = false)}
            onMouseDown={() => (keys.current[" "] = true)}
            onMouseUp={() => (keys.current[" "] = false)}
            className="w-full px-3 py-3 bg-yellow-600 text-white rounded font-semibold active:bg-yellow-700 select-none text-sm"
            style={{ touchAction: "manipulation" }}
          >
            SHOOT (Auto-Aim)
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-gray-400 text-sm max-w-md">
        <p className="md:hidden">
          Use arrows to move, shoot button auto-aims at nearest zombie
        </p>
        <p className="hidden md:block">
          Arrow keys to move, SPACE to shoot (auto-aims at nearest enemy)
        </p>
        <p className="text-xs mt-1">
          Survive waves of zombies! Use barricades for cover and collect
          supplies.
        </p>
      </div>
    </div>
  );
};

export default ZombieSurvival;
