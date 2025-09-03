import React, { useState, useEffect, useCallback, useRef } from "react";

const NeonRacing = ({ isPlaying, isPaused, onGameStateChange }) => {
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
    height: 80,
    speed: 6,
    targetX: 375,
  });

  const obstacles = useRef([]);
  const powerUps = useRef([]);
  const roadLines = useRef([]);
  const particles = useRef([]);

  // Game settings
  const lanes = [200, 300, 400, 500, 600]; // 5 lanes
  const gameSpeed = useRef(5);
  const scoreCounter = useRef(0);
  const keys = useRef({});

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset player
    player.current = {
      x: 375,
      y: 400,
      width: 50,
      height: 80,
      speed: 6,
      targetX: 375,
    };

    // Clear arrays
    obstacles.current = [];
    powerUps.current = [];
    roadLines.current = [];
    particles.current = [];

    // Reset game speed and score
    gameSpeed.current = 5;
    scoreCounter.current = 0;

    // Create road lines
    for (let i = 0; i < 20; i++) {
      roadLines.current.push({
        x: 150 + i * 20,
        y: i * 50,
        width: 4,
        height: 30,
      });
    }

    // Create initial obstacles
    for (let i = 0; i < 3; i++) {
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      obstacles.current.push({
        x: lane - 25,
        y: -150 - i * 200,
        width: 50,
        height: 80,
        lane: lane,
      });
    }

    // Create initial power-ups
    powerUps.current.push({
      x: lanes[Math.floor(Math.random() * lanes.length)] - 15,
      y: -300,
      width: 30,
      height: 30,
      type: "speed",
    });
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

  // Create particle effect
  const createParticles = (x, y, color, count = 8) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: x,
        y: y,
        velocityX: (Math.random() - 0.5) * 8,
        velocityY: Math.random() * -5 - 2,
        life: 30,
        color: color,
        size: Math.random() * 3 + 1,
      });
    }
  };

  // Handle input (keyboard and touch)
  const handleInput = useCallback(() => {
    if (!internalGameState.gameRunning) return;

    // Keyboard controls
    if (keys.current["ArrowLeft"]) {
      const currentLaneIndex = lanes.findIndex(
        (lane) => Math.abs(lane - 25 - player.current.targetX) < 10
      );
      if (currentLaneIndex > 0) {
        player.current.targetX = lanes[currentLaneIndex - 1] - 25;
      }
    }
    if (keys.current["ArrowRight"]) {
      const currentLaneIndex = lanes.findIndex(
        (lane) => Math.abs(lane - 25 - player.current.targetX) < 10
      );
      if (currentLaneIndex < lanes.length - 1) {
        player.current.targetX = lanes[currentLaneIndex + 1] - 25;
      }
    }

    // Smooth movement to target
    const dx = player.current.targetX - player.current.x;
    if (Math.abs(dx) > 2) {
      player.current.x += dx * 0.2;
    } else {
      player.current.x = player.current.targetX;
    }
  }, [internalGameState.gameRunning]);

  // Game update loop
  const updateGame = useCallback(() => {
    if (!internalGameState.gameRunning) return;

    handleInput();
    gameTimer.current++;

    // Update road lines
    roadLines.current.forEach((line) => {
      line.y += gameSpeed.current;
      if (line.y > 500) {
        line.y = -30;
      }
    });

    // Update obstacles
    obstacles.current.forEach((obstacle, index) => {
      obstacle.y += gameSpeed.current;

      // Remove obstacles that have passed
      if (obstacle.y > 500) {
        obstacles.current.splice(index, 1);
        // Add new obstacle
        const lane = lanes[Math.floor(Math.random() * lanes.length)];
        obstacles.current.push({
          x: lane - 25,
          y: -100 - Math.random() * 100,
          width: 50,
          height: 80,
          lane: lane,
        });
      }

      // Check collision with player
      if (checkCollision(player.current, obstacle)) {
        createParticles(
          player.current.x + player.current.width / 2,
          player.current.y + player.current.height / 2,
          "#ff4444",
          12
        );
        setInternalGameState((prev) => {
          const newLives = prev.lives - 1;
          const newState = {
            ...prev,
            lives: newLives,
            gameRunning: newLives > 0,
            gameOver: newLives <= 0,
          };
          onGameStateChange?.(newState);
          return newState;
        });

        // Reset player position
        player.current.x = 375;
        player.current.targetX = 375;
      }
    });

    // Update power-ups
    powerUps.current.forEach((powerUp, index) => {
      powerUp.y += gameSpeed.current;

      // Remove power-ups that have passed
      if (powerUp.y > 500) {
        powerUps.current.splice(index, 1);
        // Add new power-up occasionally
        if (Math.random() < 0.3) {
          const lane = lanes[Math.floor(Math.random() * lanes.length)];
          powerUps.current.push({
            x: lane - 15,
            y: -200 - Math.random() * 100,
            width: 30,
            height: 30,
            type: Math.random() > 0.5 ? "speed" : "points",
          });
        }
      }

      // Check collision with player
      if (checkCollision(player.current, powerUp)) {
        createParticles(
          powerUp.x + powerUp.width / 2,
          powerUp.y + powerUp.height / 2,
          "#00ff88",
          8
        );
        powerUps.current.splice(index, 1);

        if (powerUp.type === "speed") {
          gameSpeed.current = Math.max(2, gameSpeed.current - 1);
          setTimeout(() => (gameSpeed.current += 1), 3000);
        }

        setInternalGameState((prev) => {
          const newState = {
            ...prev,
            score: prev.score + (powerUp.type === "points" ? 50 : 25),
          };
          onGameStateChange?.(newState);
          return newState;
        });
      }
    });

    // Update particles
    particles.current.forEach((particle, index) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += 0.2;
      particle.life--;

      if (particle.life <= 0) {
        particles.current.splice(index, 1);
      }
    });

    // Update score and speed
    scoreCounter.current++;
    if (scoreCounter.current % 120 === 0) {
      // Every 2 seconds
      setInternalGameState((prev) => {
        const newState = { ...prev, score: prev.score + 5 };
        onGameStateChange?.(newState);
        return newState;
      });
    }

    // Increase difficulty over time
    if (scoreCounter.current % 600 === 0) {
      // Every 10 seconds
      gameSpeed.current += 0.3;
      setInternalGameState((prev) => {
        const newLevel = Math.floor(prev.score / 200) + 1;
        const newState = { ...prev, level: newLevel };
        onGameStateChange?.(newState);
        return newState;
      });
    }
  }, [internalGameState.gameRunning, handleInput, onGameStateChange]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas with neon gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#000428");
    gradient.addColorStop(1, "#004e92");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(150, 0, 500, canvas.height);

    // Draw road edges with neon glow
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(150, 0);
    ctx.lineTo(150, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(650, 0);
    ctx.lineTo(650, canvas.height);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw lane dividers
    ctx.strokeStyle = "#ffff00";
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 15]);
    for (let i = 1; i < 5; i++) {
      const x = 150 + i * 100;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw road lines (moving effect)
    roadLines.current.forEach((line) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(line.x, line.y, line.width, line.height);
    });

    // Draw obstacles (enemy cars)
    obstacles.current.forEach((obstacle) => {
      // Car body
      ctx.fillStyle = "#ff0040";
      ctx.shadowColor = "#ff0040";
      ctx.shadowBlur = 15;
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      // Car details
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(obstacle.x + 5, obstacle.y + 10, 10, 8); // Windshield
      ctx.fillRect(obstacle.x + 35, obstacle.y + 10, 10, 8);

      // Wheels
      ctx.fillStyle = "#000000";
      ctx.fillRect(obstacle.x - 3, obstacle.y + 10, 6, 15);
      ctx.fillRect(obstacle.x - 3, obstacle.y + 55, 6, 15);
      ctx.fillRect(obstacle.x + 47, obstacle.y + 10, 6, 15);
      ctx.fillRect(obstacle.x + 47, obstacle.y + 55, 6, 15);
      ctx.shadowBlur = 0;
    });

    // Draw power-ups
    powerUps.current.forEach((powerUp) => {
      if (powerUp.type === "speed") {
        ctx.fillStyle = "#00ff40";
        ctx.shadowColor = "#00ff40";
      } else {
        ctx.fillStyle = "#ffff00";
        ctx.shadowColor = "#ffff00";
      }

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
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      const symbol = powerUp.type === "speed" ? "⚡" : "★";
      ctx.fillText(
        symbol,
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2 + 5
      );
      ctx.shadowBlur = 0;
    });

    // Draw player car
    ctx.fillStyle = "#00ff88";
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 20;
    ctx.fillRect(
      player.current.x,
      player.current.y,
      player.current.width,
      player.current.height
    );

    // Player car details
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.current.x + 5, player.current.y + 20, 40, 15); // Windshield
    ctx.fillRect(player.current.x + 5, player.current.y + 45, 40, 10); // Side windows

    // Player wheels with glow
    ctx.fillStyle = "#ff00ff";
    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 10;
    ctx.fillRect(player.current.x - 3, player.current.y + 10, 6, 15);
    ctx.fillRect(player.current.x - 3, player.current.y + 55, 6, 15);
    ctx.fillRect(player.current.x + 47, player.current.y + 10, 6, 15);
    ctx.fillRect(player.current.x + 47, player.current.y + 55, 6, 15);
    ctx.shadowBlur = 0;

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

    // Draw neon speed lines
    ctx.strokeStyle = "#00ffff";
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - gameSpeed.current * 2, y + gameSpeed.current * 4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw HUD
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(10, 10, 200, 80);
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 80);

    ctx.fillStyle = "#00ffff";
    ctx.font = "16px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Speed: ${Math.floor(gameSpeed.current * 20)} km/h`, 20, 30);
    ctx.fillText(`Distance: ${Math.floor(scoreCounter.current / 10)}m`, 20, 50);
    ctx.fillText(`Items: ${inventory.current?.length || 0}`, 20, 70);
  }, []);

  // Lane switching with touch
  const switchLane = useCallback(
    (direction) => {
      if (!internalGameState.gameRunning) return;

      const currentLaneIndex = lanes.findIndex(
        (lane) => Math.abs(lane - 25 - player.current.x) < 30
      );
      let newLaneIndex = currentLaneIndex;

      if (direction === "left" && currentLaneIndex > 0) {
        newLaneIndex = currentLaneIndex - 1;
      } else if (direction === "right" && currentLaneIndex < lanes.length - 1) {
        newLaneIndex = currentLaneIndex + 1;
      }

      player.current.targetX = lanes[newLaneIndex] - 25;
    },
    [internalGameState.gameRunning]
  );

  // Handle canvas touch for lane switching
  const handleCanvasTouch = useCallback(
    (e) => {
      if (!internalGameState.gameRunning) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;

      let clientX;
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      const clickX = (clientX - rect.left) * scaleX;

      // Determine which lane to move to based on touch position
      let targetLane = 2; // Default middle lane
      if (clickX < 250) targetLane = 0;
      else if (clickX < 350) targetLane = 1;
      else if (clickX < 450) targetLane = 2;
      else if (clickX < 550) targetLane = 3;
      else targetLane = 4;

      player.current.targetX = lanes[targetLane] - 25;
      e.preventDefault();
    },
    [internalGameState.gameRunning]
  );

  const gameTimer = useRef(0);
  const inventory = useRef([]);

  // Game update loop
  useEffect(() => {
    if (!internalGameState.gameRunning) return;

    gameTimer.current++;

    // Update obstacles
    obstacles.current.forEach((obstacle, index) => {
      obstacle.y += gameSpeed.current;

      // Remove obstacles that have passed
      if (obstacle.y > 500) {
        obstacles.current.splice(index, 1);
        // Add new obstacle
        const lane = lanes[Math.floor(Math.random() * lanes.length)];
        obstacles.current.push({
          x: lane - 25,
          y: -100 - Math.random() * 100,
          width: 50,
          height: 80,
          lane: lane,
        });
      }

      // Check collision with player
      if (checkCollision(player.current, obstacle)) {
        createParticles(
          player.current.x + player.current.width / 2,
          player.current.y + player.current.height / 2,
          "#ff4444",
          12
        );
        setInternalGameState((prev) => {
          const newLives = prev.lives - 1;
          const newState = {
            ...prev,
            lives: newLives,
            gameRunning: newLives > 0,
            gameOver: newLives <= 0,
          };
          onGameStateChange?.(newState);
          return newState;
        });

        // Reset player position
        player.current.x = 375;
        player.current.targetX = 375;
      }
    });

    // Update power-ups
    powerUps.current.forEach((powerUp, index) => {
      powerUp.y += gameSpeed.current;

      if (powerUp.y > 500) {
        powerUps.current.splice(index, 1);
        if (Math.random() < 0.3) {
          const lane = lanes[Math.floor(Math.random() * lanes.length)];
          powerUps.current.push({
            x: lane - 15,
            y: -200 - Math.random() * 100,
            width: 30,
            height: 30,
            type: Math.random() > 0.5 ? "speed" : "points",
          });
        }
      }

      if (checkCollision(player.current, powerUp)) {
        createParticles(
          powerUp.x + powerUp.width / 2,
          powerUp.y + powerUp.height / 2,
          "#00ff88",
          8
        );
        powerUps.current.splice(index, 1);
        inventory.current.push(powerUp);

        setInternalGameState((prev) => {
          const newState = {
            ...prev,
            score: prev.score + (powerUp.type === "points" ? 50 : 25),
          };
          onGameStateChange?.(newState);
          return newState;
        });
      }
    });

    // Update particles
    particles.current.forEach((particle, index) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += 0.2;
      particle.life--;

      if (particle.life <= 0) {
        particles.current.splice(index, 1);
      }
    });

    // Update score and speed
    scoreCounter.current++;
    if (scoreCounter.current % 120 === 0) {
      setInternalGameState((prev) => {
        const newState = { ...prev, score: prev.score + 5 };
        onGameStateChange?.(newState);
        return newState;
      });
    }

    if (scoreCounter.current % 600 === 0) {
      gameSpeed.current += 0.3;
      setInternalGameState((prev) => {
        const newLevel = Math.floor(prev.score / 200) + 1;
        const newState = { ...prev, level: newLevel };
        onGameStateChange?.(newState);
        return newState;
      });
    }
  }, [internalGameState.gameRunning, onGameStateChange]);

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
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    const canvas = canvasRef.current;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    if (canvas) {
      canvas.addEventListener("click", handleCanvasTouch);
      canvas.addEventListener("touchstart", handleCanvasTouch, {
        passive: false,
      });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (canvas) {
        canvas.removeEventListener("click", handleCanvasTouch);
        canvas.removeEventListener("touchstart", handleCanvasTouch);
      }
    };
  }, [handleCanvasTouch]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="max-w-full max-h-full border-2 border-cyan-400 rounded-lg shadow-lg cursor-pointer touch-none"
        style={{
          boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
          background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
          touchAction: "manipulation",
        }}
      />

      {/* Mobile Controls */}
      <div className="flex md:hidden mt-4 space-x-4">
        <button
          onTouchStart={() => switchLane("left")}
          onClick={() => switchLane("left")}
          className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold active:bg-cyan-600 select-none"
          style={{ touchAction: "manipulation" }}
        >
          ← LEFT
        </button>
        <button
          onTouchStart={() => switchLane("right")}
          onClick={() => switchLane("right")}
          className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold active:bg-cyan-600 select-none"
          style={{ touchAction: "manipulation" }}
        >
          RIGHT →
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-gray-400 text-sm">
        <p className="md:hidden">
          Tap screen lanes or use buttons to switch lanes
        </p>
        <p className="hidden md:block">
          Use arrow keys or click lanes to avoid obstacles
        </p>
        <p className="text-xs mt-1">
          ⚡ Green = Speed Boost • ★ Yellow = Points
        </p>
      </div>
    </div>
  );
};

export default NeonRacing;
