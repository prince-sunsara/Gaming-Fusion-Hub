import React, { useState, useEffect, useCallback, useRef } from "react";

const TankBattle = ({ isPlaying, isPaused, onGameStateChange }) => {
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
  const playerTank = useRef({
    x: 100,
    y: 350,
    width: 40,
    height: 40,
    angle: 0,
    turretAngle: 0,
    speed: 3,
    health: 100,
    maxHealth: 100,
  });

  const enemyTanks = useRef([]);
  const bullets = useRef([]);
  const enemyBullets = useRef([]);
  const obstacles = useRef([]);
  const powerUps = useRef([]);
  const explosions = useRef([]);

  const keys = useRef({});
  const gameTimer = useRef(0);
  const shootCooldown = useRef(0);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset player tank
    playerTank.current = {
      x: 100,
      y: 350,
      width: 40,
      height: 40,
      angle: 0,
      turretAngle: 0,
      speed: 3,
      health: 100,
      maxHealth: 100,
    };

    // Create obstacles (cover)
    obstacles.current = [
      { x: 200, y: 200, width: 60, height: 40, health: 3, maxHealth: 3 },
      { x: 400, y: 150, width: 80, height: 50, health: 4, maxHealth: 4 },
      { x: 600, y: 300, width: 70, height: 45, health: 3, maxHealth: 3 },
      { x: 300, y: 400, width: 90, height: 35, health: 4, maxHealth: 4 },
      { x: 500, y: 100, width: 60, height: 60, health: 5, maxHealth: 5 },
    ];

    // Create enemy tanks
    enemyTanks.current = [];
    const enemyCount = 2 + internalGameState.level;
    for (let i = 0; i < enemyCount; i++) {
      enemyTanks.current.push({
        x: 600 + Math.random() * 100,
        y: 100 + Math.random() * 300,
        width: 35,
        height: 35,
        angle: Math.PI,
        turretAngle: Math.PI,
        speed: 1.5,
        health: 50,
        maxHealth: 50,
        shootTimer: Math.random() * 120,
        moveTimer: Math.random() * 180,
        targetX: 600,
        targetY: 200,
      });
    }

    // Create power-ups
    powerUps.current = [];
    for (let i = 0; i < 2; i++) {
      powerUps.current.push({
        x: 200 + Math.random() * 400,
        y: 150 + Math.random() * 250,
        width: 25,
        height: 25,
        type: Math.random() > 0.5 ? "health" : "ammo",
        collected: false,
      });
    }

    // Clear arrays
    bullets.current = [];
    enemyBullets.current = [];
    explosions.current = [];

    gameTimer.current = 0;
    shootCooldown.current = 0;
  }, [internalGameState.level]);

  // Collision detection
  const checkCollision = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  // Create explosion effect
  const createExplosion = (x, y, size = 1) => {
    explosions.current.push({
      x: x,
      y: y,
      size: size,
      life: 30,
      maxLife: 30,
    });
  };

  // Check line of sight between two points
  const hasLineOfSight = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(distance / 5);

    for (let i = 0; i <= steps; i++) {
      const checkX = x1 + (dx / steps) * i;
      const checkY = y1 + (dy / steps) * i;

      for (let obstacle of obstacles.current) {
        if (
          checkX >= obstacle.x &&
          checkX <= obstacle.x + obstacle.width &&
          checkY >= obstacle.y &&
          checkY <= obstacle.y + obstacle.height
        ) {
          return false;
        }
      }
    }
    return true;
  };

  // Game update loop
  const updateGame = useCallback(() => {
    if (!internalGameState.gameRunning) return;

    gameTimer.current++;
    if (shootCooldown.current > 0) shootCooldown.current--;

    // Handle player input
    const oldX = playerTank.current.x;
    const oldY = playerTank.current.y;

    if (keys.current["ArrowLeft"]) {
      playerTank.current.angle -= 0.1;
    }
    if (keys.current["ArrowRight"]) {
      playerTank.current.angle += 0.1;
    }
    if (keys.current["ArrowUp"]) {
      const newX =
        playerTank.current.x +
        Math.cos(playerTank.current.angle) * playerTank.current.speed;
      const newY =
        playerTank.current.y +
        Math.sin(playerTank.current.angle) * playerTank.current.speed;

      // Check boundaries
      if (
        newX >= 0 &&
        newX <= 800 - playerTank.current.width &&
        newY >= 0 &&
        newY <= 500 - playerTank.current.height
      ) {
        playerTank.current.x = newX;
        playerTank.current.y = newY;
      }
    }
    if (keys.current["ArrowDown"]) {
      const newX =
        playerTank.current.x -
        Math.cos(playerTank.current.angle) * playerTank.current.speed;
      const newY =
        playerTank.current.y -
        Math.sin(playerTank.current.angle) * playerTank.current.speed;

      if (
        newX >= 0 &&
        newX <= 800 - playerTank.current.width &&
        newY >= 0 &&
        newY <= 500 - playerTank.current.height
      ) {
        playerTank.current.x = newX;
        playerTank.current.y = newY;
      }
    }

    // Check collision with obstacles
    let collided = false;
    for (let obstacle of obstacles.current) {
      if (checkCollision(playerTank.current, obstacle)) {
        playerTank.current.x = oldX;
        playerTank.current.y = oldY;
        collided = true;
        break;
      }
    }

    // Turret control
    if (keys.current["a"]) playerTank.current.turretAngle -= 0.08;
    if (keys.current["d"]) playerTank.current.turretAngle += 0.08;

    // Shooting
    if (keys.current[" "] && shootCooldown.current <= 0) {
      const bulletX =
        playerTank.current.x +
        playerTank.current.width / 2 +
        Math.cos(playerTank.current.turretAngle) * 25;
      const bulletY =
        playerTank.current.y +
        playerTank.current.height / 2 +
        Math.sin(playerTank.current.turretAngle) * 25;

      bullets.current.push({
        x: bulletX,
        y: bulletY,
        dx: Math.cos(playerTank.current.turretAngle) * 8,
        dy: Math.sin(playerTank.current.turretAngle) * 8,
        width: 6,
        height: 6,
        damage: 25,
      });
      shootCooldown.current = 20;
    }

    // Update enemy tanks
    enemyTanks.current.forEach((enemy, enemyIndex) => {
      enemy.shootTimer++;
      enemy.moveTimer++;

      // AI movement
      if (enemy.moveTimer > 120) {
        enemy.targetX = Math.random() * 700 + 50;
        enemy.targetY = Math.random() * 400 + 50;
        enemy.moveTimer = 0;
      }

      // Move towards target
      const dx = enemy.targetX - enemy.x;
      const dy = enemy.targetY - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 10) {
        enemy.angle = Math.atan2(dy, dx);
        const newX = enemy.x + Math.cos(enemy.angle) * enemy.speed;
        const newY = enemy.y + Math.sin(enemy.angle) * enemy.speed;

        // Check boundaries and obstacles
        let canMove =
          newX >= 0 &&
          newX <= 800 - enemy.width &&
          newY >= 0 &&
          newY <= 500 - enemy.height;

        if (canMove) {
          for (let obstacle of obstacles.current) {
            if (
              newX < obstacle.x + obstacle.width &&
              newX + enemy.width > obstacle.x &&
              newY < obstacle.y + obstacle.height &&
              newY + enemy.height > obstacle.y
            ) {
              canMove = false;
              break;
            }
          }
        }

        if (canMove) {
          enemy.x = newX;
          enemy.y = newY;
        }
      }

      // AI turret aiming at player
      const playerDx = playerTank.current.x - enemy.x;
      const playerDy = playerTank.current.y - enemy.y;
      const playerDistance = Math.sqrt(
        playerDx * playerDx + playerDy * playerDy
      );

      if (playerDistance < 300) {
        enemy.turretAngle = Math.atan2(playerDy, playerDx);

        // Shoot at player if line of sight
        if (
          enemy.shootTimer > 80 &&
          hasLineOfSight(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            playerTank.current.x + playerTank.current.width / 2,
            playerTank.current.y + playerTank.current.height / 2
          )
        ) {
          const bulletX =
            enemy.x + enemy.width / 2 + Math.cos(enemy.turretAngle) * 20;
          const bulletY =
            enemy.y + enemy.height / 2 + Math.sin(enemy.turretAngle) * 20;

          enemyBullets.current.push({
            x: bulletX,
            y: bulletY,
            dx: Math.cos(enemy.turretAngle) * 5,
            dy: Math.sin(enemy.turretAngle) * 5,
            width: 5,
            height: 5,
            damage: 20,
          });
          enemy.shootTimer = 0;
        }
      }
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

      // Check collision with obstacles
      obstacles.current.forEach((obstacle, obstacleIndex) => {
        if (checkCollision(bullet, obstacle)) {
          bullets.current.splice(bulletIndex, 1);
          obstacle.health--;
          createExplosion(bullet.x, bullet.y, 0.5);

          if (obstacle.health <= 0) {
            obstacles.current.splice(obstacleIndex, 1);
          }
        }
      });

      // Check collision with enemy tanks
      enemyTanks.current.forEach((enemy, enemyIndex) => {
        if (checkCollision(bullet, enemy)) {
          bullets.current.splice(bulletIndex, 1);
          enemy.health -= bullet.damage;
          createExplosion(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            0.8
          );

          if (enemy.health <= 0) {
            createExplosion(
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2,
              1.5
            );
            enemyTanks.current.splice(enemyIndex, 1);

            setInternalGameState((prev) => {
              const newState = { ...prev, score: prev.score + 100 };
              onGameStateChange?.(newState);
              return newState;
            });
          }
        }
      });
    });

    // Update enemy bullets
    enemyBullets.current.forEach((bullet, bulletIndex) => {
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;

      if (bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 500) {
        enemyBullets.current.splice(bulletIndex, 1);
        return;
      }

      // Check collision with obstacles
      obstacles.current.forEach((obstacle, obstacleIndex) => {
        if (checkCollision(bullet, obstacle)) {
          enemyBullets.current.splice(bulletIndex, 1);
          obstacle.health--;
          createExplosion(bullet.x, bullet.y, 0.3);

          if (obstacle.health <= 0) {
            obstacles.current.splice(obstacleIndex, 1);
          }
        }
      });

      // Check collision with player
      if (checkCollision(bullet, playerTank.current)) {
        enemyBullets.current.splice(bulletIndex, 1);
        playerTank.current.health -= bullet.damage;
        createExplosion(
          playerTank.current.x + playerTank.current.width / 2,
          playerTank.current.y + playerTank.current.height / 2,
          1
        );

        if (playerTank.current.health <= 0) {
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

          // Reset player health
          playerTank.current.health = 100;
        }
      }
    });

    // Check power-ups
    powerUps.current.forEach((powerUp, index) => {
      if (!powerUp.collected && checkCollision(playerTank.current, powerUp)) {
        powerUp.collected = true;
        createExplosion(
          powerUp.x + powerUp.width / 2,
          powerUp.y + powerUp.height / 2,
          0.6
        );

        if (powerUp.type === "health") {
          playerTank.current.health = Math.min(
            playerTank.current.health + 50,
            100
          );
        }

        setInternalGameState((prev) => {
          const newState = { ...prev, score: prev.score + 25 };
          onGameStateChange?.(newState);
          return newState;
        });
      }
    });

    // Update explosions
    explosions.current.forEach((explosion, index) => {
      explosion.life--;
      if (explosion.life <= 0) {
        explosions.current.splice(index, 1);
      }
    });

    // Check win condition
    if (enemyTanks.current.length === 0) {
      setInternalGameState((prev) => {
        const newState = {
          ...prev,
          level: prev.level + 1,
          score: prev.score + 500,
        };
        onGameStateChange?.(newState);
        return newState;
      });

      // Next level
      setTimeout(() => {
        initGame();
      }, 2000);
    }
  }, [internalGameState.gameRunning, initGame, onGameStateChange]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear with battlefield background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#2d3436");
    gradient.addColorStop(1, "#636e72");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw obstacles
    obstacles.current.forEach((obstacle) => {
      const healthPercent = obstacle.health / obstacle.maxHealth;
      ctx.fillStyle = `rgb(${100 + 155 * healthPercent}, ${
        80 + 100 * healthPercent
      }, ${60 + 80 * healthPercent})`;
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      ctx.strokeStyle = "#2d3436";
      ctx.lineWidth = 2;
      ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw power-ups
    powerUps.current.forEach((powerUp) => {
      if (powerUp.collected) return;

      const color = powerUp.type === "health" ? "#00ff88" : "#ffaa00";
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

      // Symbol
      ctx.fillStyle = "#000000";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      const symbol = powerUp.type === "health" ? "+" : "A";
      ctx.fillText(
        symbol,
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2 + 5
      );
      ctx.shadowBlur = 0;
    });

    // Draw explosions
    explosions.current.forEach((explosion) => {
      const alpha = explosion.life / explosion.maxLife;
      const radius = (explosion.maxLife - explosion.life) * explosion.size * 3;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ff4444";
      ctx.shadowColor = "#ff4444";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;

    // Draw enemy tanks
    enemyTanks.current.forEach((enemy) => {
      ctx.save();
      ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
      ctx.rotate(enemy.angle);

      // Tank body
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(
        -enemy.width / 2,
        -enemy.height / 2,
        enemy.width,
        enemy.height
      );

      // Tank tracks
      ctx.fillStyle = "#2d3436";
      ctx.fillRect(-enemy.width / 2, -enemy.height / 2 - 3, enemy.width, 6);
      ctx.fillRect(-enemy.width / 2, enemy.height / 2 - 3, enemy.width, 6);

      ctx.restore();

      // Turret
      ctx.save();
      ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
      ctx.rotate(enemy.turretAngle);
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(-8, -6, 25, 12);
      ctx.restore();

      // Health bar
      if (enemy.health < enemy.maxHealth) {
        ctx.fillStyle = "#333";
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 4);
        ctx.fillStyle = "#e74c3c";
        ctx.fillRect(
          enemy.x,
          enemy.y - 10,
          (enemy.health / enemy.maxHealth) * enemy.width,
          4
        );
      }
    });

    // Draw player tank
    ctx.save();
    ctx.translate(
      playerTank.current.x + playerTank.current.width / 2,
      playerTank.current.y + playerTank.current.height / 2
    );
    ctx.rotate(playerTank.current.angle);

    // Tank body
    ctx.fillStyle = "#00ff88";
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 10;
    ctx.fillRect(
      -playerTank.current.width / 2,
      -playerTank.current.height / 2,
      playerTank.current.width,
      playerTank.current.height
    );

    // Tank tracks
    ctx.fillStyle = "#2d3436";
    ctx.fillRect(
      -playerTank.current.width / 2,
      -playerTank.current.height / 2 - 4,
      playerTank.current.width,
      8
    );
    ctx.fillRect(
      -playerTank.current.width / 2,
      playerTank.current.height / 2 - 4,
      playerTank.current.width,
      8
    );

    ctx.restore();

    // Player turret
    ctx.save();
    ctx.translate(
      playerTank.current.x + playerTank.current.width / 2,
      playerTank.current.y + playerTank.current.height / 2
    );
    ctx.rotate(playerTank.current.turretAngle);
    ctx.fillStyle = "#00d68f";
    ctx.fillRect(-10, -8, 30, 16);
    ctx.restore();
    ctx.shadowBlur = 0;

    // Draw bullets
    bullets.current.forEach((bullet) => {
      ctx.fillStyle = "#ffff00";
      ctx.shadowColor = "#ffff00";
      ctx.shadowBlur = 8;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });

    enemyBullets.current.forEach((bullet) => {
      ctx.fillStyle = "#ff4444";
      ctx.shadowColor = "#ff4444";
      ctx.shadowBlur = 8;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });

    // Draw HUD
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(10, 10, 200, 120);
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Level: ${internalGameState.level}`, 20, 30);
    ctx.fillText(`Enemies: ${enemyTanks.current.length}`, 20, 50);
    ctx.fillText(`Health: ${playerTank.current.health}%`, 20, 70);

    // Health bar
    ctx.fillStyle = "#333";
    ctx.fillRect(20, 80, 160, 12);
    const healthPercent =
      playerTank.current.health / playerTank.current.maxHealth;
    ctx.fillStyle =
      healthPercent > 0.5
        ? "#00ff88"
        : healthPercent > 0.25
        ? "#ffaa00"
        : "#ff4444";
    ctx.fillRect(20, 80, healthPercent * 160, 12);

    ctx.fillText("Cooldown:", 20, 110);
    ctx.fillStyle = shootCooldown.current > 0 ? "#ff4444" : "#00ff88";
    ctx.fillRect(90, 98, Math.max(0, (20 - shootCooldown.current) * 4), 8);
  }, [internalGameState.level, internalGameState.gameRunning]);

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
        className="max-w-full max-h-full border-2 border-green-500 rounded-lg shadow-lg touch-none"
        style={{
          boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
          background: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
        }}
      />

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 md:hidden mt-4">
        <button
          onTouchStart={() => (keys.current["ArrowLeft"] = true)}
          onTouchEnd={() => (keys.current["ArrowLeft"] = false)}
          onMouseDown={() => (keys.current["ArrowLeft"] = true)}
          onMouseUp={() => (keys.current["ArrowLeft"] = false)}
          className="px-3 py-2 bg-green-600 text-white rounded font-semibold active:bg-green-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          TURN L
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowUp"] = true)}
          onTouchEnd={() => (keys.current["ArrowUp"] = false)}
          onMouseDown={() => (keys.current["ArrowUp"] = true)}
          onMouseUp={() => (keys.current["ArrowUp"] = false)}
          className="px-3 py-2 bg-green-600 text-white rounded font-semibold active:bg-green-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          MOVE
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowRight"] = true)}
          onTouchEnd={() => (keys.current["ArrowRight"] = false)}
          onMouseDown={() => (keys.current["ArrowRight"] = true)}
          onMouseUp={() => (keys.current["ArrowRight"] = false)}
          className="px-3 py-2 bg-green-600 text-white rounded font-semibold active:bg-green-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          TURN R
        </button>
        <button
          onTouchStart={() => (keys.current["a"] = true)}
          onTouchEnd={() => (keys.current["a"] = false)}
          onMouseDown={() => (keys.current["a"] = true)}
          onMouseUp={() => (keys.current["a"] = false)}
          className="px-3 py-2 bg-blue-600 text-white rounded font-semibold active:bg-blue-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          AIM L
        </button>
        <button
          onTouchStart={() => (keys.current[" "] = true)}
          onTouchEnd={() => (keys.current[" "] = false)}
          onMouseDown={() => (keys.current[" "] = true)}
          onMouseUp={() => (keys.current[" "] = false)}
          className="px-3 py-2 bg-red-600 text-white rounded font-semibold active:bg-red-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          FIRE
        </button>
        <button
          onTouchStart={() => (keys.current["d"] = true)}
          onTouchEnd={() => (keys.current["d"] = false)}
          onMouseDown={() => (keys.current["d"] = true)}
          onMouseUp={() => (keys.current["d"] = false)}
          className="px-3 py-2 bg-blue-600 text-white rounded font-semibold active:bg-blue-700 select-none text-sm"
          style={{ touchAction: "manipulation" }}
        >
          AIM R
        </button>
        <div className="col-span-3 mt-2">
          <button
            onTouchStart={() => (keys.current["ArrowDown"] = true)}
            onTouchEnd={() => (keys.current["ArrowDown"] = false)}
            onMouseDown={() => (keys.current["ArrowDown"] = true)}
            onMouseUp={() => (keys.current["ArrowDown"] = false)}
            className="w-full px-3 py-2 bg-gray-600 text-white rounded font-semibold active:bg-gray-700 select-none text-sm"
            style={{ touchAction: "manipulation" }}
          >
            REVERSE
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-gray-400 text-sm max-w-md">
        <p className="md:hidden">Use control buttons to move tank and turret</p>
        <p className="hidden md:block">
          Arrow keys: move tank • A/D: aim turret • SPACE: fire
        </p>
        <p className="text-xs mt-1">
          Destroy all enemy tanks to advance levels! Use cover wisely.
        </p>
      </div>
    </div>
  );
};

export default TankBattle;
