import React, { useState, useEffect, useCallback, useRef } from "react";

const NeonRacing = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  const [gameState, setGameState] = useState({
    score: 0,
    speed: 5,
    lap: 1,
    position: 1,
    gameRunning: false,
    gameOver: false,
    raceFinished: false,
  });

  // Game objects
  const player = useRef({
    x: 200,
    y: 400,
    width: 25,
    height: 45,
    speed: 0,
    maxSpeed: 8,
    acceleration: 0.3,
    friction: 0.1,
    rotation: 0,
    rotationSpeed: 0.1,
  });

  const opponents = useRef([]);
  const trackSegments = useRef([]);
  const particles = useRef([]);
  const keys = useRef({});
  const cameraOffset = useRef(0);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    player.current.x = 200;
    player.current.y = 400;
    player.current.speed = 0;
    player.current.rotation = 0;

    opponents.current = [];
    particles.current = [];
    cameraOffset.current = 0;

    // Create track segments (simple oval)
    trackSegments.current = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radiusX = 300;
    const radiusY = 180;

    for (let i = 0; i < 360; i += 10) {
      const angle = (i * Math.PI) / 180;
      trackSegments.current.push({
        x: centerX + Math.cos(angle) * radiusX,
        y: centerY + Math.sin(angle) * radiusY,
        angle: angle + Math.PI / 2,
        segment: i / 10,
      });
    }

    // Create AI opponents
    for (let i = 0; i < 5; i++) {
      opponents.current.push({
        x: 180 + i * 30,
        y: 350 - i * 40,
        width: 22,
        height: 40,
        speed: 4 + Math.random() * 2,
        trackPosition: Math.random() * trackSegments.current.length,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        lapProgress: 0,
      });
    }
  }, []);

  // Create particle effect
  const createParticles = (x, y, color, count = 5, type = "spark") => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: type === "exhaust" ? 15 : 25,
        maxLife: type === "exhaust" ? 15 : 25,
        color: color,
        size:
          type === "exhaust" ? Math.random() * 2 + 1 : Math.random() * 3 + 1,
        type: type,
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

  // Game update loop
  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState.gameRunning) return;

    // Player input
    if (keys.current["ArrowUp"] || keys.current["w"]) {
      player.current.speed = Math.min(
        player.current.speed + player.current.acceleration,
        player.current.maxSpeed
      );
      // Create exhaust particles
      if (Math.random() < 0.3) {
        createParticles(
          player.current.x + player.current.width / 2,
          player.current.y + player.current.height,
          "#ff6600",
          2,
          "exhaust"
        );
      }
    } else if (keys.current["ArrowDown"] || keys.current["s"]) {
      player.current.speed = Math.max(
        player.current.speed - player.current.acceleration * 2,
        -player.current.maxSpeed * 0.5
      );
    } else {
      player.current.speed *= 1 - player.current.friction;
    }

    if (keys.current["ArrowLeft"] || keys.current["a"]) {
      player.current.rotation -=
        player.current.rotationSpeed * Math.abs(player.current.speed) * 0.1;
    }
    if (keys.current["ArrowRight"] || keys.current["d"]) {
      player.current.rotation +=
        player.current.rotationSpeed * Math.abs(player.current.speed) * 0.1;
    }

    // Update player position
    player.current.x +=
      Math.cos(player.current.rotation) * player.current.speed;
    player.current.y +=
      Math.sin(player.current.rotation) * player.current.speed;

    // Keep player in bounds
    player.current.x = Math.max(
      50,
      Math.min(canvas.width - 50, player.current.x)
    );
    player.current.y = Math.max(
      50,
      Math.min(canvas.height - 50, player.current.y)
    );

    // Update opponents
    opponents.current.forEach((opponent, index) => {
      // Opponent AI (simple follow-the-track)
      const targetSegment =
        trackSegments.current[Math.floor(opponent.trackPosition)];
      const nextSegment =
        trackSegments.current[
          Math.floor(opponent.trackPosition + 1) % trackSegments.current.length
        ];
      const targetX = targetSegment.x;
      const targetY = targetSegment.y;

      const angleToTarget = Math.atan2(
        targetY - opponent.y,
        targetX - opponent.x
      );
      opponent.x += Math.cos(angleToTarget) * opponent.speed;
      opponent.y += Math.sin(angleToTarget) * opponent.speed;

      opponent.trackPosition =
        (opponent.trackPosition + 0.1) % trackSegments.current.length;

      // Update opponent lap progress
      const distanceToNext = Math.sqrt(
        Math.pow(nextSegment.x - opponent.x, 2) +
          Math.pow(nextSegment.y - opponent.y, 2)
      );
      if (distanceToNext < 10) {
        opponent.lapProgress = opponent.lapProgress + 1;
      }
    });

    // Simple lap detection (when player passes start line)
    const startLineY = 400;
    if (
      Math.abs(player.current.y - startLineY) < 20 &&
      player.current.x > canvas.width / 2
    ) {
      setGameState((prev) => ({ ...prev, lap: prev.lap + 1 }));
      if (gameState.lap >= 3) {
        setGameState((prev) => ({
          ...prev,
          gameRunning: false,
          raceFinished: true,
        }));
      }
    }
  }, [gameState.gameRunning, gameState.lap]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas with neon background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width
    );
    gradient.addColorStop(0, "#0a0a0a");
    gradient.addColorStop(1, "#1a0a1a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw track outline
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 10;
    ctx.beginPath();

    trackSegments.current.forEach((segment, index) => {
      if (index === 0) {
        ctx.moveTo(segment.x, segment.y);
      } else {
        ctx.lineTo(segment.x, segment.y);
      }
    });
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw inner track
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 8;
    ctx.beginPath();

    trackSegments.current.forEach((segment, index) => {
      const innerX = segment.x + Math.cos(segment.angle + Math.PI) * 40;
      const innerY = segment.y + Math.sin(segment.angle + Math.PI) * 40;

      if (index === 0) {
        ctx.moveTo(innerX, innerY);
      } else {
        ctx.lineTo(innerX, innerY);
      }
    });
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw start/finish line
    ctx.strokeStyle = "#ffff00";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#ffff00";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(150, 400);
    ctx.lineTo(250, 400);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw grid pattern
    ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw particles
    particles.current.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = alpha;

      if (particle.type === "exhaust") {
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 8;
      }

      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });

    // Draw opponents
    opponents.current.forEach((opponent) => {
      ctx.fillStyle = opponent.color;
      ctx.shadowColor = opponent.color;
      ctx.shadowBlur = 12;
      ctx.fillRect(opponent.x, opponent.y, opponent.width, opponent.height);
      ctx.shadowBlur = 0;
    });

    // Draw player
    ctx.save();
    ctx.translate(
      player.current.x + player.current.width / 2,
      player.current.y + player.current.height / 2
    );
    ctx.rotate(player.current.rotation);

    const playerGradient = ctx.createLinearGradient(-15, -20, -15, 20);
    playerGradient.addColorStop(0, "#00ffff");
    playerGradient.addColorStop(0.5, "#0080ff");
    playerGradient.addColorStop(1, "#0040ff");

    ctx.fillStyle = playerGradient;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 20;
    ctx.fillRect(
      -player.current.width / 2,
      -player.current.height / 2,
      player.current.width,
      player.current.height
    );
    ctx.shadowBlur = 0;
    ctx.restore();

    // Draw speed lines when going fast
    if (Math.abs(player.current.speed) > 5) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - player.current.speed * 3, y);
        ctx.stroke();
      }
    }
  }, []);

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
      speed: 0,
      lap: 1,
      position: 1,
      gameRunning: true,
      gameOver: false,
      raceFinished: false,
    }));
  };

  // Reset game
  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      score: 0,
      speed: 0,
      lap: 1,
      position: 1,
      gameRunning: false,
      gameOver: false,
      raceFinished: false,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="relative">
        {/* Game Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-2 border-cyan-500 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.5)]"
        />

        {/* UI Overlay */}
        <div className="absolute top-4 left-4 text-white">
          <div className="bg-black bg-opacity-70 p-3 rounded-lg border border-cyan-500">
            <div className="text-lg font-bold">Score: {gameState.score}</div>
            <div className="text-lg font-bold">
              Speed: {gameState.speed.toFixed(1)}
            </div>
            <div className="text-lg font-bold">Lap: {gameState.lap}/3</div>
            <div className="text-sm text-cyan-400">
              Position: {gameState.position}/6
            </div>
          </div>
        </div>

        {/* Speed indicator */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black bg-opacity-70 p-2 rounded-lg border border-cyan-500">
            <div className="text-white text-sm mb-1">Speed</div>
            <div className="w-20 h-3 bg-gray-600 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all"
                style={{
                  width: `${Math.min((gameState.speed / 8) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Race Finished Screen */}
        {gameState.raceFinished && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg">
            <div className="bg-slate-800 p-8 rounded-xl border-2 border-yellow-500 text-center shadow-[0_0_30px_rgba(255,215,0,0.5)]">
              <h2 className="text-3xl font-bold text-white mb-4">
                Race Complete!
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                Final Score: {gameState.score}
              </p>
              <p className="text-lg text-cyan-400 mb-6">
                Position: {gameState.position}/6
              </p>
              <div className="space-x-4">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                >
                  Race Again
                </button>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!gameState.gameRunning && !gameState.raceFinished && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg">
            <div className="bg-slate-800 p-8 rounded-xl border-2 border-cyan-500 text-center shadow-[0_0_30px_rgba(0,255,255,0.5)]">
              <h1 className="text-4xl font-bold text-white mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Neon Racing
              </h1>
              <p className="text-gray-300 mb-6">
                Race through the neon track! Complete 3 laps as fast as
                possible!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xl rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)]"
              >
                Start Race
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 text-center text-gray-400 space-y-1">
        <p>Arrow Keys or WASD to control your vehicle</p>
        <p>↑/W: Accelerate, ↓/S: Brake, ←/→ or A/D: Steer</p>
      </div>
    </div>
  );
};

export default NeonRacing;
