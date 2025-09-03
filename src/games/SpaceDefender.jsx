import React, { useState, useEffect, useCallback, useRef } from "react";

const SpaceDefender = ({ isPlaying, isPaused, onGameStateChange }) => {
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
    x: 375,
    y: 400,
    width: 50,
    height: 60,
    speed: 6,
    health: 100,
  });

  const bullets = useRef([]);
  const enemies = useRef([]);
  const enemyBullets = useRef([]);
  const powerUps = useRef([]);
  const particles = useRef([]);
  const stars = useRef([]);

  const keys = useRef({});
  const gameTimer = useRef(0);
  const enemySpawnTimer = useRef(0);
  const powerUpSpawnTimer = useRef(0);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset player
    player.current = {
      x: 375,
      y: 400,
      width: 50,
      height: 60,
      speed: 6,
      health: 100,
    };

    // Clear arrays
    bullets.current = [];
    enemies.current = [];
    enemyBullets.current = [];
    powerUps.current = [];
    particles.current = [];

    // Create starfield
    stars.current = [];
    for (let i = 0; i < 100; i++) {
      stars.current.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1,
      });
    }

    gameTimer.current = 0;
    enemySpawnTimer.current = 0;
    powerUpSpawnTimer.current = 0;
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

  // Create particle explosion
  const createExplosion = (x, y, color, count = 10) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: x,
        y: y,
        velocityX: (Math.random() - 0.5) * 12,
        velocityY: (Math.random() - 0.5) * 12,
        life: 30,
        color: color,
        size: Math.random() * 4 + 2,
      });
    }
  };

  // Spawn enemy
  const spawnEnemy = () => {
    const enemyTypes = [
      {
        width: 40,
        height: 40,
        health: 1,
        speed: 2,
        color: "#ff4444",
        points: 10,
      },
      {
        width: 60,
        height: 50,
        health: 2,
        speed: 1.5,
        color: "#ff8800",
        points: 25,
      },
      {
        width: 80,
        height: 60,
        health: 3,
        speed: 1,
        color: "#ff0088",
        points: 50,
      },
    ];

    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    enemies.current.push({
      x: Math.random() * (800 - type.width),
      y: -type.height,
      width: type.width,
      height: type.height,
      health: type.health,
      maxHealth: type.health,
      speed: type.speed,
      color: type.color,
      points: type.points,
      shootTimer: Math.random() * 120,
    });
  };

  // Spawn power-up
  const spawnPowerUp = () => {
    const types = ["health", "rapidfire", "shield"];
    const type = types[Math.floor(Math.random() * types.length)];

    powerUps.current.push({
      x: Math.random() * 750,
      y: -30,
      width: 30,
      height: 30,
      type: type,
      speed: 2,
    });
  };

  // Handle shooting
  const shoot = () => {
    bullets.current.push({
      x: player.current.x + player.current.width / 2 - 2,
      y: player.current.y,
      width: 4,
      height: 15,
      speed: 10,
    });
  };

  // Game update loop
  const updateGame = useCallback(() => {
    if (!internalGameState.gameRunning) return;

    gameTimer.current++;
    enemySpawnTimer.current++;
    powerUpSpawnTimer.current++;

    // Handle input
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
    if (keys.current[" "] && gameTimer.current % 10 === 0) {
      shoot();
    }

    // Update stars
    stars.current.forEach((star) => {
      star.y += star.speed;
      if (star.y > 500) {
        star.y = 0;
        star.x = Math.random() * 800;
      }
    });

    // Spawn enemies
    const spawnRate = Math.max(60 - internalGameState.level * 5, 20);
    if (enemySpawnTimer.current > spawnRate) {
      spawnEnemy();
      enemySpawnTimer.current = 0;
    }

    // Spawn power-ups
    if (powerUpSpawnTimer.current > 600) {
      // Every 10 seconds
      spawnPowerUp();
      powerUpSpawnTimer.current = 0;
    }

    // Update bullets
    bullets.current.forEach((bullet, bulletIndex) => {
      bullet.y -= bullet.speed;

      if (bullet.y < 0) {
        bullets.current.splice(bulletIndex, 1);
        return;
      }

      // Check enemy collisions
      enemies.current.forEach((enemy, enemyIndex) => {
        if (checkCollision(bullet, enemy)) {
          bullets.current.splice(bulletIndex, 1);
          enemy.health--;

          createExplosion(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            "#ffaa00",
            5
          );

          if (enemy.health <= 0) {
            createExplosion(
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2,
              enemy.color,
              15
            );
            setInternalGameState((prev) => {
              const newState = { ...prev, score: prev.score + enemy.points };
              onGameStateChange?.(newState);
              return newState;
            });
            enemies.current.splice(enemyIndex, 1);
          }
        }
      });
    });

    // Update enemies
    enemies.current.forEach((enemy, index) => {
      enemy.y += enemy.speed;
      enemy.shootTimer++;

      // Remove enemies that passed
      if (enemy.y > 500) {
        enemies.current.splice(index, 1);
        return;
      }

      // Enemy shooting
      if (enemy.shootTimer > 120 && Math.random() < 0.01) {
        enemyBullets.current.push({
          x: enemy.x + enemy.width / 2 - 2,
          y: enemy.y + enemy.height,
          width: 4,
          height: 12,
          speed: 4,
        });
        enemy.shootTimer = 0;
      }

      // Check collision with player
      if (checkCollision(player.current, enemy)) {
        createExplosion(
          player.current.x + player.current.width / 2,
          player.current.y + player.current.height / 2,
          "#ff4444",
          12
        );
        enemies.current.splice(index, 1);

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
      }
    });

    // Update enemy bullets
    enemyBullets.current.forEach((bullet, index) => {
      bullet.y += bullet.speed;

      if (bullet.y > 500) {
        enemyBullets.current.splice(index, 1);
        return;
      }

      // Check collision with player
      if (checkCollision(bullet, player.current)) {
        createExplosion(bullet.x, bullet.y, "#ff4444", 8);
        enemyBullets.current.splice(index, 1);

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
      }
    });

    // Update power-ups
    powerUps.current.forEach((powerUp, index) => {
      powerUp.y += powerUp.speed;

      if (powerUp.y > 500) {
        powerUps.current.splice(index, 1);
        return;
      }

      // Check collision with player
      if (checkCollision(powerUp, player.current)) {
        createExplosion(
          powerUp.x + powerUp.width / 2,
          powerUp.y + powerUp.height / 2,
          "#00ff88",
          8
        );
        powerUps.current.splice(index, 1);

        let bonus = 0;
        switch (powerUp.type) {
          case "health":
            bonus = 25;
            break;
          case "rapidfire":
            bonus = 50;
            break;
          case "shield":
            bonus = 75;
            break;
        }

        setInternalGameState((prev) => {
          const newState = { ...prev, score: prev.score + bonus };
          onGameStateChange?.(newState);
          return newState;
        });
      }
    });

    // Update particles
    particles.current.forEach((particle, index) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.life--;

      if (particle.life <= 0) {
        particles.current.splice(index, 1);
      }
    });

    // Level progression
    if (gameTimer.current % 1800 === 0) {
      // Every 30 seconds
      setInternalGameState((prev) => {
        const newState = {
          ...prev,
          level: prev.level + 1,
          score: prev.score + 100,
        };
        onGameStateChange?.(newState);
        return newState;
      });
    }
  }, [
    internalGameState.gameRunning,
    internalGameState.level,
    onGameStateChange,
  ]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Space background
    const gradient = ctx.createRadialGradient(400, 250, 0, 400, 250, 400);
    gradient.addColorStop(0, "#000033");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw moving stars
    ctx.fillStyle = "#ffffff";
    stars.current.forEach((star) => {
      ctx.globalAlpha = 0.8;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1;

    // Draw player spaceship
    ctx.fillStyle = "#00ff88";
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 15;

    // Ship body
    ctx.beginPath();
    ctx.moveTo(player.current.x + player.current.width / 2, player.current.y);
    ctx.lineTo(player.current.x, player.current.y + player.current.height);
    ctx.lineTo(
      player.current.x + player.current.width / 4,
      player.current.y + player.current.height - 10
    );
    ctx.lineTo(
      player.current.x + (player.current.width * 3) / 4,
      player.current.y + player.current.height - 10
    );
    ctx.lineTo(
      player.current.x + player.current.width,
      player.current.y + player.current.height
    );
    ctx.closePath();
    ctx.fill();

    // Ship details
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.current.x + 20, player.current.y + 15, 10, 5);
    ctx.fillRect(player.current.x + 15, player.current.y + 25, 20, 3);
    ctx.shadowBlur = 0;

    // Draw player bullets
    bullets.current.forEach((bullet) => {
      ctx.fillStyle = "#00ffff";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 10;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });

    // Draw enemies
    enemies.current.forEach((enemy) => {
      ctx.fillStyle = enemy.color;
      ctx.shadowColor = enemy.color;
      ctx.shadowBlur = 12;

      // Enemy ship shape
      ctx.beginPath();
      ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
      ctx.lineTo(enemy.x, enemy.y);
      ctx.lineTo(enemy.x + enemy.width / 4, enemy.y + 10);
      ctx.lineTo(enemy.x + (enemy.width * 3) / 4, enemy.y + 10);
      ctx.lineTo(enemy.x + enemy.width, enemy.y);
      ctx.closePath();
      ctx.fill();

      // Health bar
      if (enemy.health < enemy.maxHealth) {
        ctx.fillStyle = "#333";
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 4);
        ctx.fillStyle = "#ff4444";
        ctx.fillRect(
          enemy.x,
          enemy.y - 10,
          (enemy.health / enemy.maxHealth) * enemy.width,
          4
        );
      }
      ctx.shadowBlur = 0;
    });

    // Draw enemy bullets
    enemyBullets.current.forEach((bullet) => {
      ctx.fillStyle = "#ff4444";
      ctx.shadowColor = "#ff4444";
      ctx.shadowBlur = 8;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });

    // Draw power-ups
    powerUps.current.forEach((powerUp) => {
      let color;
      switch (powerUp.type) {
        case "health":
          color = "#00ff00";
          break;
        case "rapidfire":
          color = "#ffff00";
          break;
        case "shield":
          color = "#0088ff";
          break;
        default:
          color = "#ffffff";
      }

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2,
        powerUp.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Power-up symbol
      ctx.fillStyle = "#000000";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      let symbol;
      switch (powerUp.type) {
        case "health":
          symbol = "+";
          break;
        case "rapidfire":
          symbol = "R";
          break;
        case "shield":
          symbol = "S";
          break;
      }
      ctx.fillText(
        symbol,
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2 + 4
      );
      ctx.shadowBlur = 0;
    });

    // Draw particles
    particles.current.forEach((particle) => {
      ctx.globalAlpha = particle.life / 30;
      ctx.fillStyle = particle.color;
      ctx.fillRect(
        particle.x - particle.size / 2,
        particle.y - particle.size / 2,
        particle.size,
        particle.size
      );
    });
    ctx.globalAlpha = 1;

    // Draw HUD
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(10, 10, 200, 100);
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 100);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Wave: ${internalGameState.level}`, 20, 30);
    ctx.fillText(`Enemies: ${enemies.current.length}`, 20, 50);
    ctx.fillText(`Health: ${player.current.health}%`, 20, 70);

    // Health bar
    ctx.fillStyle = "#333";
    ctx.fillRect(20, 80, 160, 8);
    ctx.fillStyle =
      player.current.health > 50
        ? "#00ff00"
        : player.current.health > 25
        ? "#ffff00"
        : "#ff4444";
    ctx.fillRect(20, 80, (player.current.health / 100) * 160, 8);
  }, [internalGameState.level, internalGameState.gameRunning]);

  // Handle canvas click/touch
  const handleCanvasTouch = useCallback(
    (e) => {
      if (!internalGameState.gameRunning) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let clientX, clientY;
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const touchX = (clientX - rect.left) * scaleX;
      const touchY = (clientY - rect.top) * scaleY;

      // Move player towards touch position (smoothly)
      player.current.x = Math.max(
        0,
        Math.min(touchX - player.current.width / 2, 800 - player.current.width)
      );

      // Shoot when touching
      shoot();

      e.preventDefault();
    },
    [internalGameState.gameRunning]
  );

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

  // Keyboard and touch handlers
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

    const canvas = canvasRef.current;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    if (canvas) {
      canvas.addEventListener("touchmove", handleCanvasTouch, {
        passive: false,
      });
      canvas.addEventListener("touchstart", handleCanvasTouch, {
        passive: false,
      });
      canvas.addEventListener("click", handleCanvasTouch);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (canvas) {
        canvas.removeEventListener("touchmove", handleCanvasTouch);
        canvas.removeEventListener("touchstart", handleCanvasTouch);
        canvas.removeEventListener("click", handleCanvasTouch);
      }
    };
  }, [handleCanvasTouch]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="max-w-full max-h-full border-2 border-cyan-400 rounded-lg shadow-lg cursor-crosshair touch-none"
        style={{
          boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
          background: "radial-gradient(circle, #000033 0%, #000000 100%)",
          touchAction: "manipulation",
        }}
      />

      {/* Mobile Controls */}
      <div className="flex md:hidden mt-4 space-x-2">
        <button
          onTouchStart={() => (keys.current["ArrowLeft"] = true)}
          onTouchEnd={() => (keys.current["ArrowLeft"] = false)}
          onMouseDown={() => (keys.current["ArrowLeft"] = true)}
          onMouseUp={() => (keys.current["ArrowLeft"] = false)}
          className="px-3 py-3 bg-cyan-600 text-white rounded-lg font-semibold active:bg-cyan-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          ←
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowRight"] = true)}
          onTouchEnd={() => (keys.current["ArrowRight"] = false)}
          onMouseDown={() => (keys.current["ArrowRight"] = true)}
          onMouseUp={() => (keys.current["ArrowRight"] = false)}
          className="px-3 py-3 bg-cyan-600 text-white rounded-lg font-semibold active:bg-cyan-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          →
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowUp"] = true)}
          onTouchEnd={() => (keys.current["ArrowUp"] = false)}
          onMouseDown={() => (keys.current["ArrowUp"] = true)}
          onMouseUp={() => (keys.current["ArrowUp"] = false)}
          className="px-3 py-3 bg-cyan-600 text-white rounded-lg font-semibold active:bg-cyan-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          ↑
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowDown"] = true)}
          onTouchEnd={() => (keys.current["ArrowDown"] = false)}
          onMouseDown={() => (keys.current["ArrowDown"] = true)}
          onMouseUp={() => (keys.current["ArrowDown"] = false)}
          className="px-3 py-3 bg-cyan-600 text-white rounded-lg font-semibold active:bg-cyan-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          ↓
        </button>
        <button
          onTouchStart={() => (keys.current[" "] = true)}
          onTouchEnd={() => (keys.current[" "] = false)}
          onMouseDown={() => (keys.current[" "] = true)}
          onMouseUp={() => (keys.current[" "] = false)}
          className="px-4 py-3 bg-red-600 text-white rounded-lg font-semibold active:bg-red-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          FIRE
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-gray-400 text-sm max-w-md">
        <p className="md:hidden">
          Touch screen to move and shoot, or use control buttons
        </p>
        <p className="hidden md:block">Arrow keys to move, SPACE to shoot</p>
        <p className="text-xs mt-1">💚 Health • ⚡ Rapid Fire • 🛡️ Shield</p>
      </div>
    </div>
  );
};

export default SpaceDefender;
