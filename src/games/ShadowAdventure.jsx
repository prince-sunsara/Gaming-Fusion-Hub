import React, { useState, useEffect, useCallback, useRef } from "react";

const ShadowAdventure = ({ isPlaying, isPaused, onGameStateChange }) => {
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
    x: 50,
    y: 350,
    width: 25,
    height: 35,
    velocityY: 0,
    jumping: false,
    onGround: true,
    speed: 4,
    inShadow: false,
    detected: false,
  });

  const platforms = useRef([]);
  const shadows = useRef([]);
  const enemies = useRef([]);
  const artifacts = useRef([]);
  const keys = useRef({});

  // Game settings
  const gravity = 0.6;
  const jumpPower = -12;
  const groundY = 400;
  const detectionRadius = 80;

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset player
    player.current = {
      x: 50,
      y: 350,
      width: 25,
      height: 35,
      velocityY: 0,
      jumping: false,
      onGround: true,
      speed: 4,
      inShadow: false,
      detected: false,
    };

    // Create platforms
    platforms.current = [
      { x: 0, y: groundY, width: canvas.width, height: 100 }, // Ground
      { x: 200, y: 320, width: 120, height: 20 },
      { x: 400, y: 280, width: 100, height: 20 },
      { x: 600, y: 240, width: 150, height: 20 },
      { x: 300, y: 180, width: 80, height: 20 },
      { x: 500, y: 160, width: 120, height: 20 },
    ];

    // Create shadow areas
    shadows.current = [
      { x: 150, y: 300, width: 100, height: 100 },
      { x: 350, y: 200, width: 80, height: 100 },
      { x: 550, y: 120, width: 90, height: 140 },
      { x: 680, y: 180, width: 70, height: 80 },
    ];

    // Create enemies (guards with patrol routes)
    enemies.current = [
      {
        x: 250,
        y: 300,
        width: 20,
        height: 30,
        patrol: { start: 200, end: 350, speed: 1, direction: 1 },
        detectionRange: 60,
        alert: false,
      },
      {
        x: 450,
        y: 260,
        width: 20,
        height: 30,
        patrol: { start: 400, end: 520, speed: 0.8, direction: 1 },
        detectionRange: 70,
        alert: false,
      },
      {
        x: 600,
        y: 220,
        width: 20,
        height: 30,
        patrol: { start: 550, end: 700, speed: 1.2, direction: 1 },
        detectionRange: 80,
        alert: false,
      },
    ];

    // Create artifacts to collect
    artifacts.current = [
      { x: 220, y: 290, width: 15, height: 15, collected: false, type: "gem" },
      { x: 420, y: 250, width: 15, height: 15, collected: false, type: "gem" },
      { x: 620, y: 210, width: 15, height: 15, collected: false, type: "gem" },
      {
        x: 320,
        y: 150,
        width: 15,
        height: 15,
        collected: false,
        type: "crystal",
      },
      {
        x: 540,
        y: 130,
        width: 15,
        height: 15,
        collected: false,
        type: "crystal",
      },
    ];
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

  // Check if player is in shadow
  const checkShadowStatus = () => {
    player.current.inShadow = shadows.current.some((shadow) =>
      checkCollision(player.current, shadow)
    );
  };

  // Handle movement input
  const handleInput = () => {
    if (!internalGameState.gameRunning) return;

    // Horizontal movement
    if (keys.current["ArrowLeft"] && player.current.x > 0) {
      player.current.x -= player.current.speed;
    }
    if (
      keys.current["ArrowRight"] &&
      player.current.x < 800 - player.current.width
    ) {
      player.current.x += player.current.speed;
    }

    // Jumping
    if (
      (keys.current["Space"] || keys.current["ArrowUp"]) &&
      player.current.onGround
    ) {
      player.current.velocityY = jumpPower;
      player.current.jumping = true;
      player.current.onGround = false;
    }
  };

  // Game update loop
  const updateGame = useCallback(() => {
    if (!internalGameState.gameRunning) return;

    handleInput();

    // Update player physics
    player.current.velocityY += gravity;
    player.current.y += player.current.velocityY;

    // Platform collisions
    platforms.current.forEach((platform) => {
      if (
        checkCollision(player.current, platform) &&
        player.current.velocityY > 0
      ) {
        player.current.y = platform.y - player.current.height;
        player.current.velocityY = 0;
        player.current.jumping = false;
        player.current.onGround = true;
      }
    });

    // Check shadow status
    checkShadowStatus();

    // Update enemies
    enemies.current.forEach((enemy) => {
      // Patrol movement
      enemy.x += enemy.patrol.speed * enemy.patrol.direction;
      if (enemy.x <= enemy.patrol.start || enemy.x >= enemy.patrol.end) {
        enemy.patrol.direction *= -1;
      }

      // Detection logic
      const distance = Math.sqrt(
        Math.pow(player.current.x - enemy.x, 2) +
          Math.pow(player.current.y - enemy.y, 2)
      );

      // Only detect if player is not in shadow and within range
      if (distance < enemy.detectionRange && !player.current.inShadow) {
        enemy.alert = true;
        player.current.detected = true;

        // Player caught
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

        // Reset player position
        player.current.x = 50;
        player.current.y = 350;
        player.current.velocityY = 0;
        player.current.detected = false;

        // Reset enemy alert after delay
        setTimeout(() => {
          enemy.alert = false;
        }, 2000);
      } else if (distance > enemy.detectionRange + 20) {
        enemy.alert = false;
        player.current.detected = false;
      }
    });

    // Artifact collection
    artifacts.current.forEach((artifact) => {
      if (!artifact.collected && checkCollision(player.current, artifact)) {
        artifact.collected = true;
        const points = artifact.type === "crystal" ? 50 : 25;

        setInternalGameState((prev) => {
          const newState = { ...prev, score: prev.score + points };
          onGameStateChange?.(newState);
          return newState;
        });
      }
    });

    // Check win condition
    if (artifacts.current.every((artifact) => artifact.collected)) {
      setInternalGameState((prev) => {
        const newState = {
          ...prev,
          gameWon: true,
          gameRunning: false,
          level: prev.level + 1,
        };
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

    // Clear canvas with dark gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0f0f23");
    gradient.addColorStop(0.7, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    platforms.current.forEach((platform) => {
      ctx.fillStyle = "#2d3436";
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

      // Platform edges
      ctx.strokeStyle = "#636e72";
      ctx.lineWidth = 2;
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw shadow areas
    shadows.current.forEach((shadow) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(shadow.x, shadow.y, shadow.width, shadow.height);

      // Shadow border
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(shadow.x, shadow.y, shadow.width, shadow.height);
      ctx.setLineDash([]);
    });

    // Draw artifacts
    artifacts.current.forEach((artifact) => {
      if (artifact.collected) return;

      const centerX = artifact.x + artifact.width / 2;
      const centerY = artifact.y + artifact.height / 2;

      if (artifact.type === "gem") {
        ctx.fillStyle = "#e17055";
        ctx.shadowColor = "#e17055";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(centerX, centerY, artifact.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#00cec9";
        ctx.shadowColor = "#00cec9";
        ctx.shadowBlur = 20;

        // Draw crystal shape
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - artifact.height / 2);
        ctx.lineTo(centerX + artifact.width / 2, centerY);
        ctx.lineTo(centerX, centerY + artifact.height / 2);
        ctx.lineTo(centerX - artifact.width / 2, centerY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    });

    // Draw enemies
    enemies.current.forEach((enemy) => {
      // Enemy body
      ctx.fillStyle = enemy.alert ? "#e74c3c" : "#f39c12";
      ctx.shadowColor = enemy.alert ? "#e74c3c" : "#f39c12";
      ctx.shadowBlur = enemy.alert ? 20 : 10;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // Enemy eyes
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(enemy.x + 3, enemy.y + 5, 4, 4);
      ctx.fillRect(enemy.x + 13, enemy.y + 5, 4, 4);

      // Detection range (when alert)
      if (enemy.alert) {
        ctx.strokeStyle = "rgba(231, 76, 60, 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          enemy.detectionRange,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    });

    // Draw player
    const playerColor = player.current.inShadow
      ? "#6c5ce7"
      : player.current.detected
      ? "#e74c3c"
      : "#74b9ff";

    ctx.fillStyle = playerColor;
    ctx.shadowColor = playerColor;
    ctx.shadowBlur = player.current.inShadow ? 15 : 10;
    ctx.fillRect(
      player.current.x,
      player.current.y,
      player.current.width,
      player.current.height
    );

    // Player details
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.current.x + 5, player.current.y + 8, 3, 3); // Eye
    ctx.fillRect(player.current.x + 12, player.current.y + 8, 3, 3); // Eye

    // Player shadow indicator
    if (player.current.inShadow) {
      ctx.fillStyle = "rgba(108, 92, 231, 0.3)";
      ctx.fillRect(
        player.current.x - 10,
        player.current.y - 10,
        player.current.width + 20,
        player.current.height + 20
      );
    }
    ctx.shadowBlur = 0;

    // Draw UI elements
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(10, 10, 250, 100);
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 250, 100);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.fillText("STEALTH MODE", 20, 30);
    ctx.fillText(
      `Artifacts: ${artifacts.current.filter((a) => a.collected).length}/${
        artifacts.current.length
      }`,
      20,
      50
    );
    ctx.fillText(
      `Status: ${
        player.current.inShadow
          ? "HIDDEN"
          : player.current.detected
          ? "DETECTED!"
          : "EXPOSED"
      }`,
      20,
      70
    );

    // Status indicator
    const statusColor = player.current.inShadow
      ? "#00ff88"
      : player.current.detected
      ? "#ff4444"
      : "#ffaa00";
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(240, 85, 8, 0, Math.PI * 2);
    ctx.fill();

    // Instructions
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Stay in shadows to avoid detection!",
      canvas.width / 2,
      canvas.height - 20
    );
  }, []);

  // Handle touch/click for movement
  const handleCanvasClick = useCallback(
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

      const clickX = (clientX - rect.left) * scaleX;
      const clickY = (clientY - rect.top) * scaleY;

      // Simple movement towards click
      if (clickX < player.current.x) {
        keys.current["ArrowLeft"] = true;
        setTimeout(() => (keys.current["ArrowLeft"] = false), 200);
      } else if (clickX > player.current.x + player.current.width) {
        keys.current["ArrowRight"] = true;
        setTimeout(() => (keys.current["ArrowRight"] = false), 200);
      }

      // Jump if clicking above player
      if (clickY < player.current.y && player.current.onGround) {
        player.current.velocityY = jumpPower;
        player.current.jumping = true;
        player.current.onGround = false;
      }

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
      } else if (
        !internalGameState.gameRunning &&
        (internalGameState.gameOver || internalGameState.gameWon)
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
      canvas.addEventListener("click", handleCanvasClick);
      canvas.addEventListener("touchstart", handleCanvasClick, {
        passive: false,
      });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (canvas) {
        canvas.removeEventListener("click", handleCanvasClick);
        canvas.removeEventListener("touchstart", handleCanvasClick);
      }
    };
  }, [handleCanvasClick]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="max-w-full max-h-full border-2 border-purple-500 rounded-lg shadow-lg cursor-pointer touch-none"
        style={{
          boxShadow: "0 0 20px rgba(108, 92, 231, 0.5)",
          background:
            "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
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
          className="px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold active:bg-purple-700 select-none"
          style={{ touchAction: "manipulation" }}
        >
          ← LEFT
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowRight"] = true)}
          onTouchEnd={() => (keys.current["ArrowRight"] = false)}
          onMouseDown={() => (keys.current["ArrowRight"] = true)}
          onMouseUp={() => (keys.current["ArrowRight"] = false)}
          className="px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold active:bg-purple-700 select-none"
          style={{ touchAction: "manipulation" }}
        >
          RIGHT →
        </button>
        <button
          onTouchStart={() => {
            if (player.current.onGround) {
              player.current.velocityY = jumpPower;
              player.current.jumping = true;
              player.current.onGround = false;
            }
          }}
          onClick={() => {
            if (player.current.onGround) {
              player.current.velocityY = jumpPower;
              player.current.jumping = true;
              player.current.onGround = false;
            }
          }}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold active:bg-cyan-700 select-none"
          style={{ touchAction: "manipulation" }}
        >
          JUMP
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-gray-400 text-sm max-w-md">
        <p className="md:hidden">Use buttons or tap screen to move and jump</p>
        <p className="hidden md:block">
          Arrow keys to move, SPACE or UP to jump
        </p>
        <p className="text-xs mt-1">
          Stay in dark shadows to avoid guard detection! Collect all artifacts
          to win.
        </p>
      </div>
    </div>
  );
};

export default ShadowAdventure;
