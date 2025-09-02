import React, { useState, useEffect, useCallback, useRef } from "react";

const CyberRunner = ({ isPlaying, isPaused, onGameStateChange }) => {
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
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    velocityY: 0,
    jumping: false,
    onGround: true,
  });

  const obstacles = useRef([]);
  const powerUps = useRef([]);
  const particles = useRef([]);
  const keys = useRef({});

  // Game settings
  const gravity = 0.8;
  const jumpPower = -15;
  const gameSpeed = useRef(5);
  const groundY = 400;
  const scoreCounter = useRef(0);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset player
    player.current = {
      x: 100,
      y: groundY - 40,
      width: 40,
      height: 40,
      velocityY: 0,
      jumping: false,
      onGround: true,
    };

    // Clear arrays
    obstacles.current = [];
    powerUps.current = [];
    particles.current = [];

    // Reset game speed
    gameSpeed.current = 5;
    scoreCounter.current = 0;

    // Create initial obstacles
    for (let i = 0; i < 3; i++) {
      obstacles.current.push({
        x: canvas.width + i * 300,
        y: groundY - 60,
        width: 30,
        height: 60,
        type: "obstacle",
      });
    }

    // Create initial power-ups
    powerUps.current.push({
      x: canvas.width + 200,
      y: groundY - 100,
      width: 20,
      height: 20,
      type: "coin",
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
  const createParticles = (x, y, color, count = 5) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: x,
        y: y,
        velocityX: (Math.random() - 0.5) * 10,
        velocityY: Math.random() * -8 - 2,
        life: 30,
        color: color,
      });
    }
  };

  // Game update loop
  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !internalGameState.gameRunning) return;

    // Handle player input
    if (keys.current["Space"] || keys.current["ArrowUp"]) {
      if (player.current.onGround) {
        player.current.velocityY = jumpPower;
        player.current.jumping = true;
        player.current.onGround = false;
      }
    }

    // Update player physics
    player.current.velocityY += gravity;
    player.current.y += player.current.velocityY;

    // Ground collision
    if (player.current.y >= groundY - player.current.height) {
      player.current.y = groundY - player.current.height;
      player.current.velocityY = 0;
      player.current.jumping = false;
      player.current.onGround = true;
    }

    // Update obstacles
    obstacles.current.forEach((obstacle, index) => {
      obstacle.x -= gameSpeed.current;

      // Remove obstacles that have passed
      if (obstacle.x + obstacle.width < 0) {
        obstacles.current.splice(index, 1);
        // Add new obstacle
        obstacles.current.push({
          x:
            Math.max(...obstacles.current.map((o) => o.x)) +
            250 +
            Math.random() * 200,
          y: groundY - 60,
          width: 30,
          height: 60,
          type: "obstacle",
        });
      }

      // Check collision with player
      if (checkCollision(player.current, obstacle)) {
        createParticles(
          player.current.x + player.current.width / 2,
          player.current.y + player.current.height / 2,
          "#ff4444",
          8
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
      }
    });

    // Update power-ups
    powerUps.current.forEach((powerUp, index) => {
      powerUp.x -= gameSpeed.current;

      // Remove power-ups that have passed
      if (powerUp.x + powerUp.width < 0) {
        powerUps.current.splice(index, 1);
        // Add new power-up
        if (Math.random() < 0.3) {
          powerUps.current.push({
            x:
              Math.max(...obstacles.current.map((o) => o.x)) +
              100 +
              Math.random() * 200,
            y: groundY - 100 - Math.random() * 50,
            width: 20,
            height: 20,
            type: "coin",
          });
        }
      }

      // Check collision with player
      if (checkCollision(player.current, powerUp)) {
        createParticles(
          powerUp.x + powerUp.width / 2,
          powerUp.y + powerUp.height / 2,
          "#00ff88",
          6
        );
        powerUps.current.splice(index, 1);
        setInternalGameState((prev) => {
          const newState = { ...prev, score: prev.score + 10 };
          onGameStateChange?.(newState);
          return newState;
        });
      }
    });

    // Update particles
    particles.current.forEach((particle, index) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += 0.3; // gravity for particles
      particle.life--;

      if (particle.life <= 0) {
        particles.current.splice(index, 1);
      }
    });

    // Update score and speed
    scoreCounter.current++;
    if (scoreCounter.current % 60 === 0) {
      // Every second at 60 FPS
      setInternalGameState((prev) => {
        const newState = { ...prev, score: prev.score + 1 };
        onGameStateChange?.(newState);
        return newState;
      });
    }

    // Increase speed over time
    if (scoreCounter.current % 300 === 0) {
      // Every 5 seconds
      gameSpeed.current += 0.5;
      setInternalGameState((prev) => {
        const newLevel = Math.floor(prev.score / 100) + 1;
        const newState = { ...prev, level: newLevel };
        onGameStateChange?.(newState);
        return newState;
      });
    }
  }, [internalGameState.gameRunning, onGameStateChange]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas with cyberpunk gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0a0a2e");
    gradient.addColorStop(0.5, "#16213e");
    gradient.addColorStop(1, "#0f3460");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = "#00ff88";
    ctx.globalAlpha = 0.1;
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
    ctx.globalAlpha = 1;

    // Draw ground
    ctx.fillStyle = "#00ff88";
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 10;
    ctx.fillRect(0, groundY, canvas.width, 10);
    ctx.shadowBlur = 0;

    // Draw player with glow effect
    ctx.fillStyle = "#ff0080";
    ctx.shadowColor = "#ff0080";
    ctx.shadowBlur = 20;
    ctx.fillRect(
      player.current.x,
      player.current.y,
      player.current.width,
      player.current.height
    );

    // Player details (simple robot design)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.current.x + 10, player.current.y + 8, 8, 8); // Eye
    ctx.fillRect(player.current.x + 22, player.current.y + 8, 8, 8); // Eye
    ctx.shadowBlur = 0;

    // Draw obstacles
    obstacles.current.forEach((obstacle) => {
      ctx.fillStyle = "#ff4444";
      ctx.shadowColor = "#ff4444";
      ctx.shadowBlur = 15;
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      // Obstacle details
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(obstacle.x + 5, obstacle.y + 10, 20, 3);
      ctx.fillRect(obstacle.x + 5, obstacle.y + 20, 20, 3);
      ctx.fillRect(obstacle.x + 5, obstacle.y + 30, 20, 3);
      ctx.shadowBlur = 0;
    });

    // Draw power-ups
    powerUps.current.forEach((powerUp) => {
      ctx.fillStyle = "#00ff88";
      ctx.shadowColor = "#00ff88";
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
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        "¢",
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2 + 4
      );
      ctx.shadowBlur = 0;
    });

    // Draw particles
    particles.current.forEach((particle) => {
      ctx.globalAlpha = particle.life / 30;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
    });
    ctx.globalAlpha = 1;

    // Draw speed lines for movement effect
    ctx.strokeStyle = "#00ff88";
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(gameSpeed.current * 10, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, []);

  // Handle parent control changes
  useEffect(() => {
    if (isPlaying && !isPaused) {
      if (
        !internalGameState.gameRunning &&
        !internalGameState.gameOver &&
        !internalGameState.gameWon
      ) {
        // Start new game
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
        // Restart game
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
        // Resume game
        setInternalGameState((prev) => ({ ...prev, gameRunning: true }));
      }
    } else {
      // Pause game
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
        e.preventDefault(); // Prevent page scrolling
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
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="max-w-full max-h-full border-2 border-cyan-500 rounded-lg shadow-lg"
        style={{
          boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
          background:
            "linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      />
    </div>
  );
};

export default CyberRunner;
