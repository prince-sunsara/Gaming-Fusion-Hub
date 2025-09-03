import React, { useState, useEffect, useCallback, useRef } from "react";

const BlockBreaker = ({ isPlaying, isPaused, onGameStateChange }) => {
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
  const paddle = useRef({
    x: 0,
    y: 0,
    width: 100,
    height: 15,
    speed: 8,
  });

  const ball = useRef({
    x: 0,
    y: 0,
    radius: 8,
    dx: 4,
    dy: -4,
    speed: 4,
  });

  const blocks = useRef([]);
  const keys = useRef({});

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set paddle position
    paddle.current.x = canvas.width / 2 - paddle.current.width / 2;
    paddle.current.y = canvas.height - 30;

    // Set ball position
    ball.current.x = canvas.width / 2;
    ball.current.y = paddle.current.y - ball.current.radius;
    ball.current.dx = (Math.random() > 0.5 ? 1 : -1) * ball.current.speed;
    ball.current.dy = -ball.current.speed;

    // Create blocks
    const blockRows = 5;
    const blockCols = 8;
    const blockWidth = 80;
    const blockHeight = 20;
    const blockPadding = 5;
    const offsetTop = 60;
    const offsetLeft = 35;

    blocks.current = [];
    for (let row = 0; row < blockRows; row++) {
      for (let col = 0; col < blockCols; col++) {
        blocks.current.push({
          x: col * (blockWidth + blockPadding) + offsetLeft,
          y: row * (blockHeight + blockPadding) + offsetTop,
          width: blockWidth,
          height: blockHeight,
          destroyed: false,
          color: `hsl(${row * 60}, 70%, 60%)`,
        });
      }
    }
  }, []);

  // Collision detection
  const checkCollision = (ball, rect) => {
    return (
      ball.x + ball.radius > rect.x &&
      ball.x - ball.radius < rect.x + rect.width &&
      ball.y + ball.radius > rect.y &&
      ball.y - ball.radius < rect.y + rect.height
    );
  };

  // Game update loop
  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !internalGameState.gameRunning) return;

    // Move paddle
    if (keys.current["ArrowLeft"] && paddle.current.x > 0) {
      paddle.current.x -= paddle.current.speed;
    }
    if (
      keys.current["ArrowRight"] &&
      paddle.current.x < canvas.width - paddle.current.width
    ) {
      paddle.current.x += paddle.current.speed;
    }

    // Move ball
    ball.current.x += ball.current.dx;
    ball.current.y += ball.current.dy;

    // Ball collision with walls
    if (
      ball.current.x + ball.current.radius > canvas.width ||
      ball.current.x - ball.current.radius < 0
    ) {
      ball.current.dx = -ball.current.dx;
    }
    if (ball.current.y - ball.current.radius < 0) {
      ball.current.dy = -ball.current.dy;
    }

    // Ball collision with paddle
    if (checkCollision(ball.current, paddle.current) && ball.current.dy > 0) {
      const hitPos = (ball.current.x - paddle.current.x) / paddle.current.width;
      ball.current.dx = 8 * (hitPos - 0.5);
      ball.current.dy = -Math.abs(ball.current.dy);
    }

    // Ball collision with blocks
    blocks.current.forEach((block, index) => {
      if (!block.destroyed && checkCollision(ball.current, block)) {
        block.destroyed = true;
        ball.current.dy = -ball.current.dy;
        setInternalGameState((prev) => {
          const newState = { ...prev, score: prev.score + 10 };
          // Notify parent of state change
          onGameStateChange?.(newState);
          return newState;
        });
      }
    });

    // Check for ball falling off screen
    if (ball.current.y > canvas.height) {
      setInternalGameState((prev) => {
        const newLives = prev.lives - 1;
        const newState = {
          ...prev,
          lives: newLives,
          gameRunning: newLives > 0,
          gameOver: newLives <= 0,
        };
        // Notify parent of state change
        onGameStateChange?.(newState);
        return newState;
      });

      // Reset ball position if lives remain
      if (internalGameState.lives > 1) {
        ball.current.x = canvas.width / 2;
        ball.current.y = paddle.current.y - ball.current.radius;
        ball.current.dx = (Math.random() > 0.5 ? 1 : -1) * ball.current.speed;
        ball.current.dy = -ball.current.speed;
      }
    }

    // Check for level completion
    if (blocks.current.every((block) => block.destroyed)) {
      setInternalGameState((prev) => {
        const newState = {
          ...prev,
          gameRunning: false,
          gameWon: true,
          level: prev.level + 1,
        };
        // Notify parent of state change
        onGameStateChange?.(newState);
        return newState;
      });
    }
  }, [
    internalGameState.gameRunning,
    internalGameState.lives,
    onGameStateChange,
  ]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw blocks
    blocks.current.forEach((block) => {
      if (!block.destroyed) {
        ctx.fillStyle = block.color;
        ctx.shadowColor = block.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(block.x, block.y, block.width, block.height);
        ctx.shadowBlur = 0;
      }
    });

    // Draw paddle
    const paddleGradient = ctx.createLinearGradient(
      0,
      paddle.current.y,
      0,
      paddle.current.y + paddle.current.height
    );
    paddleGradient.addColorStop(0, "#0ea5e9");
    paddleGradient.addColorStop(1, "#0284c7");
    ctx.fillStyle = paddleGradient;
    ctx.shadowColor = "#0ea5e9";
    ctx.shadowBlur = 15;
    ctx.fillRect(
      paddle.current.x,
      paddle.current.y,
      paddle.current.width,
      paddle.current.height
    );
    ctx.shadowBlur = 0;

    // Draw ball
    ctx.beginPath();
    ctx.arc(
      ball.current.x,
      ball.current.y,
      ball.current.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#d946ef";
    ctx.shadowColor = "#d946ef";
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;
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
      } else if (
        !internalGameState.gameRunning &&
        (internalGameState.gameOver || internalGameState.gameWon)
      ) {
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

  // Keyboard and touch handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    // Touch/Mouse handlers for mobile
    const handlePointerMove = (e) => {
      if (!internalGameState.gameRunning) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;

      let clientX;
      if (e.touches) {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      const x = (clientX - rect.left) * scaleX;
      paddle.current.x = Math.max(
        0,
        Math.min(
          canvas.width - paddle.current.width,
          x - paddle.current.width / 2
        )
      );

      e.preventDefault();
    };

    const canvas = canvasRef.current;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    if (canvas) {
      // Touch events
      canvas.addEventListener("touchmove", handlePointerMove, {
        passive: false,
      });
      canvas.addEventListener("touchstart", handlePointerMove, {
        passive: false,
      });
      // Mouse events for desktop
      canvas.addEventListener("mousemove", handlePointerMove);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (canvas) {
        canvas.removeEventListener("touchmove", handlePointerMove);
        canvas.removeEventListener("touchstart", handlePointerMove);
        canvas.removeEventListener("mousemove", handlePointerMove);
      }
    };
  }, [internalGameState.gameRunning]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="max-w-full max-h-full border-2 border-blue-500 rounded-lg shadow-lg touch-none"
        style={{
          boxShadow: "0 0 20px rgba(14, 165, 233, 0.5)",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      />

      {/* Mobile Controls */}
      <div className="flex md:hidden mt-4 space-x-4">
        <button
          onTouchStart={() => (keys.current["ArrowLeft"] = true)}
          onTouchEnd={() => (keys.current["ArrowLeft"] = false)}
          onMouseDown={() => (keys.current["ArrowLeft"] = true)}
          onMouseUp={() => (keys.current["ArrowLeft"] = false)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold active:bg-blue-600 select-none"
          style={{ touchAction: "manipulation" }}
        >
          ←
        </button>
        <button
          onTouchStart={() => (keys.current["ArrowRight"] = true)}
          onTouchEnd={() => (keys.current["ArrowRight"] = false)}
          onMouseDown={() => (keys.current["ArrowRight"] = true)}
          onMouseUp={() => (keys.current["ArrowRight"] = false)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold active:bg-blue-600 select-none"
          style={{ touchAction: "manipulation" }}
        >
          →
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-gray-400 text-sm">
        <p className="md:hidden">
          Touch and drag to move paddle or use buttons
        </p>
        <p className="hidden md:block">
          Use arrow keys or mouse to move paddle
        </p>
      </div>
    </div>
  );
};

export default BlockBreaker;
