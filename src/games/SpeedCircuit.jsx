import React, { useState, useEffect, useCallback, useRef } from "react";

const SpeedCircuit = ({ isPlaying, isPaused, onGameStateChange }) => {
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
  const car = useRef({
    x: 400,
    y: 350,
    width: 30,
    height: 50,
    angle: 0,
    speed: 0,
    maxSpeed: 8,
    acceleration: 0.3,
    friction: 0.15,
    turnSpeed: 0.08,
  });

  const track = useRef({
    centerX: 400,
    centerY: 250,
    outerRadius: 220,
    innerRadius: 120,
    segments: [],
  });

  const checkpoints = useRef([]);
  const obstacles = useRef([]);
  const powerUps = useRef([]);
  const particles = useRef([]);

  const keys = useRef({});
  const gameTimer = useRef(0);
  const lapTime = useRef(0);
  const bestLap = useRef(Infinity);
  const currentCheckpoint = useRef(0);
  const lapsCompleted = useRef(0);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset car
    car.current = {
      x: 400,
      y: 120,
      width: 30,
      height: 50,
      angle: Math.PI / 2, // Facing down
      speed: 0,
      maxSpeed: 8,
      acceleration: 0.3,
      friction: 0.15,
      turnSpeed: 0.08,
    };

    // Generate track segments
    track.current.segments = [];
    const numSegments = 16;
    for (let i = 0; i < numSegments; i++) {
      const angle = (i / numSegments) * Math.PI * 2;
      const variation = Math.sin(i * 0.5) * 30; // Track variation
      track.current.segments.push({
        angle: angle,
        outerRadius: track.current.outerRadius + variation,
        innerRadius: track.current.innerRadius + variation * 0.5,
      });
    }

    // Create checkpoints
    checkpoints.current = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius =
        (track.current.outerRadius + track.current.innerRadius) / 2;
      checkpoints.current.push({
        x: track.current.centerX + Math.cos(angle) * radius,
        y: track.current.centerY + Math.sin(angle) * radius,
        angle: angle,
        passed: false,
        width: 40,
        height: 10,
      });
    }

    // Create obstacles
    obstacles.current = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius =
        track.current.innerRadius +
        Math.random() * (track.current.outerRadius - track.current.innerRadius);
      obstacles.current.push({
        x: track.current.centerX + Math.cos(angle) * radius,
        y: track.current.centerY + Math.sin(angle) * radius,
        width: 20,
        height: 20,
        angle: angle,
      });
    }

    // Create power-ups
    powerUps.current = [];
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius =
        track.current.innerRadius +
        Math.random() * (track.current.outerRadius - track.current.innerRadius);
      powerUps.current.push({
        x: track.current.centerX + Math.cos(angle) * radius,
        y: track.current.centerY + Math.sin(angle) * radius,
        width: 25,
        height: 25,
        type: Math.random() > 0.5 ? "speed" : "points",
        collected: false,
      });
    }

    gameTimer.current = 0;
    lapTime.current = 0;
    currentCheckpoint.current = 0;
    lapsCompleted.current = 0;
    particles.current = [];
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

  // Check if point is on track
  const isOnTrack = (x, y) => {
    const dx = x - track.current.centerX;
    const dy = y - track.current.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const angle = Math.atan2(dy, dx);
    const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
    const segmentIndex = Math.floor(
      (normalizedAngle / (Math.PI * 2)) * track.current.segments.length
    );
    const segment =
      track.current.segments[segmentIndex] || track.current.segments[0];

    return distance >= segment.innerRadius && distance <= segment.outerRadius;
  };

  // Create particles
  const createParticles = (x, y, color, count = 8) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: x,
        y: y,
        velocityX: (Math.random() - 0.5) * 6,
        velocityY: (Math.random() - 0.5) * 6,
        life: 30,
        color: color,
        size: Math.random() * 3 + 1,
      });
    }
  };

  // Game update loop
  const updateGame = useCallback(() => {
    if (!internalGameState.gameRunning) return;

    gameTimer.current++;
    lapTime.current++;

    // Handle input
    let turning = 0;
    let accelerating = false;

    if (keys.current["ArrowLeft"]) turning -= 1;
    if (keys.current["ArrowRight"]) turning += 1;
    if (keys.current["ArrowUp"] || keys.current[" "]) accelerating = true;

    // Update car physics
    if (accelerating) {
      car.current.speed = Math.min(
        car.current.speed + car.current.acceleration,
        car.current.maxSpeed
      );
    } else {
      car.current.speed = Math.max(car.current.speed - car.current.friction, 0);
    }

    // Apply turning
    if (car.current.speed > 0.5) {
      car.current.angle +=
        turning *
        car.current.turnSpeed *
        (car.current.speed / car.current.maxSpeed);
    }

    // Move car
    car.current.x += Math.cos(car.current.angle) * car.current.speed;
    car.current.y += Math.sin(car.current.angle) * car.current.speed;

    // Check track boundaries
    if (!isOnTrack(car.current.x, car.current.y)) {
      // Slow down when off track
      car.current.speed *= 0.7;
      createParticles(car.current.x, car.current.y, "#8B4513", 3);

      // Small damage
      if (gameTimer.current % 30 === 0) {
        setInternalGameState((prev) => {
          const newLives = prev.lives - 0.1;
          if (newLives <= 0) {
            const newState = { ...prev, lives: 0, gameOver: true };
            onGameStateChange?.(newState);
            return newState;
          }
          return { ...prev, lives: newLives };
        });
      }
    }

    // Check checkpoints
    checkpoints.current.forEach((checkpoint, index) => {
      if (!checkpoint.passed) {
        const distance = Math.sqrt(
          Math.pow(car.current.x - checkpoint.x, 2) +
            Math.pow(car.current.y - checkpoint.y, 2)
        );

        if (distance < 30 && index === currentCheckpoint.current) {
          checkpoint.passed = true;
          currentCheckpoint.current =
            (currentCheckpoint.current + 1) % checkpoints.current.length;

          createParticles(checkpoint.x, checkpoint.y, "#00ff88", 10);

          setInternalGameState((prev) => {
            const newState = { ...prev, score: prev.score + 25 };
            onGameStateChange?.(newState);
            return newState;
          });

          // Complete lap
          if (currentCheckpoint.current === 0) {
            lapsCompleted.current++;
            if (lapTime.current < bestLap.current) {
              bestLap.current = lapTime.current;
            }

            setInternalGameState((prev) => {
              const newState = {
                ...prev,
                score: prev.score + 100,
                level: lapsCompleted.current + 1,
              };
              onGameStateChange?.(newState);
              return newState;
            });

            // Reset checkpoints
            checkpoints.current.forEach((cp) => (cp.passed = false));
            lapTime.current = 0;

            // Win condition
            if (lapsCompleted.current >= 3) {
              setInternalGameState((prev) => {
                const newState = { ...prev, gameWon: true, gameRunning: false };
                onGameStateChange?.(newState);
                return newState;
              });
            }
          }
        }
      }
    });

    // Check obstacles
    obstacles.current.forEach((obstacle) => {
      if (checkCollision(car.current, obstacle)) {
        createParticles(car.current.x, car.current.y, "#ff4444", 12);
        car.current.speed *= 0.3;

        setInternalGameState((prev) => {
          const newLives = prev.lives - 0.5;
          if (newLives <= 0) {
            const newState = { ...prev, lives: 0, gameOver: true };
            onGameStateChange?.(newState);
            return newState;
          }
          return { ...prev, lives: newLives };
        });
      }
    });

    // Check power-ups
    powerUps.current.forEach((powerUp) => {
      if (!powerUp.collected && checkCollision(car.current, powerUp)) {
        powerUp.collected = true;
        createParticles(powerUp.x, powerUp.y, "#ffff00", 8);

        if (powerUp.type === "speed") {
          car.current.maxSpeed += 1;
          setTimeout(() => (car.current.maxSpeed -= 1), 5000);
        }

        const points = powerUp.type === "speed" ? 50 : 30;
        setInternalGameState((prev) => {
          const newState = { ...prev, score: prev.score + points };
          onGameStateChange?.(newState);
          return newState;
        });
      }
    });

    // Update particles
    particles.current.forEach((particle, index) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityX *= 0.98;
      particle.velocityY *= 0.98;
      particle.life--;

      if (particle.life <= 0) {
        particles.current.splice(index, 1);
      }
    });

    // Add engine particles when accelerating
    if (accelerating && car.current.speed > 2) {
      const exhaustX = car.current.x - Math.cos(car.current.angle) * 25;
      const exhaustY = car.current.y - Math.sin(car.current.angle) * 25;
      createParticles(exhaustX, exhaustY, "#ff8800", 2);
    }
  }, [internalGameState.gameRunning, onGameStateChange]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear with racing background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw track
    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.arc(
      track.current.centerX,
      track.current.centerY,
      track.current.outerRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw track inner hole
    ctx.fillStyle = "#636e72";
    ctx.beginPath();
    ctx.arc(
      track.current.centerX,
      track.current.centerY,
      track.current.innerRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw track variations
    ctx.strokeStyle = "#74b9ff";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.arc(
      track.current.centerX,
      track.current.centerY,
      (track.current.outerRadius + track.current.innerRadius) / 2,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw track borders
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(
      track.current.centerX,
      track.current.centerY,
      track.current.outerRadius,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      track.current.centerX,
      track.current.centerY,
      track.current.innerRadius,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // Draw checkpoints
    checkpoints.current.forEach((checkpoint, index) => {
      const color = checkpoint.passed
        ? "#00ff88"
        : index === currentCheckpoint.current
        ? "#ffff00"
        : "#ffffff";

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = checkpoint.passed ? 0 : 15;

      ctx.save();
      ctx.translate(checkpoint.x, checkpoint.y);
      ctx.rotate(checkpoint.angle + Math.PI / 2);
      ctx.fillRect(
        -checkpoint.width / 2,
        -checkpoint.height / 2,
        checkpoint.width,
        checkpoint.height
      );
      ctx.restore();
      ctx.shadowBlur = 0;

      // Checkpoint number
      ctx.fillStyle = "#000000";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText((index + 1).toString(), checkpoint.x, checkpoint.y + 4);
    });

    // Draw obstacles
    obstacles.current.forEach((obstacle) => {
      ctx.fillStyle = "#e74c3c";
      ctx.shadowColor = "#e74c3c";
      ctx.shadowBlur = 10;
      ctx.save();
      ctx.translate(obstacle.x, obstacle.y);
      ctx.rotate(obstacle.angle);
      ctx.fillRect(
        -obstacle.width / 2,
        -obstacle.height / 2,
        obstacle.width,
        obstacle.height
      );

      // Hazard stripes
      ctx.fillStyle = "#000000";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(
          -obstacle.width / 2 + i * 7,
          -obstacle.height / 2,
          3,
          obstacle.height
        );
      }
      ctx.restore();
      ctx.shadowBlur = 0;
    });

    // Draw power-ups
    powerUps.current.forEach((powerUp) => {
      if (powerUp.collected) return;

      const color = powerUp.type === "speed" ? "#00ff88" : "#ffff00";
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(powerUp.x, powerUp.y, powerUp.width / 2, 0, Math.PI * 2);
      ctx.fill();

      // Power-up symbol
      ctx.fillStyle = "#000000";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      const symbol = powerUp.type === "speed" ? "S" : "P";
      ctx.fillText(symbol, powerUp.x, powerUp.y + 4);
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

    // Draw car
    ctx.fillStyle = "#e84393";
    ctx.shadowColor = "#e84393";
    ctx.shadowBlur = 15;

    ctx.save();
    ctx.translate(car.current.x, car.current.y);
    ctx.rotate(car.current.angle);

    // Car body
    ctx.fillRect(
      -car.current.width / 2,
      -car.current.height / 2,
      car.current.width,
      car.current.height
    );

    // Car details
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-8, -15, 16, 8); // Windshield
    ctx.fillRect(-6, -25, 4, 6); // Front lights
    ctx.fillRect(2, -25, 4, 6);

    // Speed indicator
    if (car.current.speed > 4) {
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-15 - i * 5, 0);
        ctx.lineTo(-20 - i * 5, 0);
        ctx.stroke();
      }
    }

    ctx.restore();
    ctx.shadowBlur = 0;

    // Draw HUD
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(10, 10, 250, 120);
    ctx.strokeStyle = "#74b9ff";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 250, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Lap: ${lapsCompleted.current + 1}/3`, 20, 30);
    ctx.fillText(`Speed: ${Math.floor(car.current.speed * 20)} km/h`, 20, 50);
    ctx.fillText(`Checkpoint: ${currentCheckpoint.current + 1}/8`, 20, 70);
    ctx.fillText(`Lap Time: ${Math.floor(lapTime.current / 60)}s`, 20, 90);
    if (bestLap.current < Infinity) {
      ctx.fillText(`Best: ${Math.floor(bestLap.current / 60)}s`, 20, 110);
    }

    // Speed meter
    const meterX = 680;
    const meterY = 60;
    const meterRadius = 40;

    ctx.strokeStyle = "#636e72";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(meterX, meterY, meterRadius, 0.75 * Math.PI, 0.25 * Math.PI);
    ctx.stroke();

    const speedPercent = car.current.speed / car.current.maxSpeed;
    const speedAngle = 0.75 * Math.PI + speedPercent * 1.5 * Math.PI;

    ctx.strokeStyle =
      speedPercent > 0.8
        ? "#e74c3c"
        : speedPercent > 0.5
        ? "#f39c12"
        : "#00ff88";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(meterX, meterY, meterRadius, 0.75 * Math.PI, speedAngle);
    ctx.stroke();
  }, [internalGameState.gameRunning]);

  // Handle canvas touch/click
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

      const touchX = (clientX - rect.left) * scaleX;

      // Simple steering based on touch position
      if (touchX < canvas.width / 3) {
        keys.current["ArrowLeft"] = true;
        setTimeout(() => (keys.current["ArrowLeft"] = false), 100);
      } else if (touchX > (canvas.width * 2) / 3) {
        keys.current["ArrowRight"] = true;
        setTimeout(() => (keys.current["ArrowRight"] = false), 100);
      } else {
        keys.current["ArrowUp"] = true;
        setTimeout(() => (keys.current["ArrowUp"] = false), 100);
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
        className="max-w-full max-h-full border-2 border-blue-400 rounded-lg shadow-lg cursor-pointer touch-none"
        style={{
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
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
          className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700 select-none"
          style={{ touchAction: "manipulation" }}
        >
          ← STEER LEFT
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowUp"] = true)}
          onTouchEnd={() => (keys.current["ArrowUp"] = false)}
          onMouseDown={() => (keys.current["ArrowUp"] = true)}
          onMouseUp={() => (keys.current["ArrowUp"] = false)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold active:bg-green-700 select-none"
          style={{ touchAction: "manipulation" }}
        >
          ACCELERATE
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowRight"] = true)}
          onTouchEnd={() => (keys.current["ArrowRight"] = false)}
          onMouseDown={() => (keys.current["ArrowRight"] = true)}
          onMouseUp={() => (keys.current["ArrowRight"] = false)}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700 select-none"
          style={{ touchAction: "manipulation" }}
        >
          STEER RIGHT →
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-gray-400 text-sm max-w-md">
        <p className="md:hidden">
          Use buttons or tap: LEFT = steer left, CENTER = accelerate, RIGHT =
          steer right
        </p>
        <p className="hidden md:block">
          Arrow keys to steer and accelerate, or SPACE for boost
        </p>
        <p className="text-xs mt-1">
          Complete 3 laps by passing through checkpoints in order!
        </p>
      </div>
    </div>
  );
};

export default SpeedCircuit;
