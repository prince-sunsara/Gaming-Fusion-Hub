import React, { useState, useEffect, useCallback, useRef } from "react";

const HauntedManor = ({ isPlaying, isPaused, onGameStateChange }) => {
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

  // Game state
  const player = useRef({
    x: 100,
    y: 350,
    width: 30,
    height: 40,
    speed: 3,
    moving: false,
    targetX: 100,
    targetY: 350,
  });

  const rooms = useRef([
    {
      id: "entrance",
      name: "Manor Entrance",
      background: "#1a1a2e",
      items: [
        {
          id: "key1",
          x: 200,
          y: 300,
          width: 20,
          height: 15,
          collected: false,
          type: "key",
        },
        {
          id: "candle1",
          x: 450,
          y: 280,
          width: 15,
          height: 25,
          collected: false,
          type: "candle",
        },
      ],
      doors: [
        { x: 350, y: 250, width: 60, height: 80, to: "hallway", locked: false },
      ],
      ghosts: [
        { x: 300, y: 200, radius: 20, speed: 1, direction: 1, active: true },
      ],
    },
    {
      id: "hallway",
      name: "Dark Hallway",
      background: "#16213e",
      items: [
        {
          id: "gem1",
          x: 150,
          y: 320,
          width: 18,
          height: 18,
          collected: false,
          type: "gem",
        },
        {
          id: "scroll1",
          x: 500,
          y: 300,
          width: 25,
          height: 20,
          collected: false,
          type: "scroll",
        },
      ],
      doors: [
        { x: 50, y: 250, width: 60, height: 80, to: "entrance", locked: false },
        { x: 600, y: 250, width: 60, height: 80, to: "library", locked: true },
      ],
      ghosts: [
        { x: 400, y: 150, radius: 25, speed: 0.8, direction: -1, active: true },
        { x: 250, y: 250, radius: 18, speed: 1.2, direction: 1, active: true },
      ],
    },
    {
      id: "library",
      name: "Haunted Library",
      background: "#0f3460",
      items: [
        {
          id: "book1",
          x: 300,
          y: 290,
          width: 20,
          height: 25,
          collected: false,
          type: "book",
        },
        {
          id: "crystal",
          x: 400,
          y: 200,
          width: 30,
          height: 30,
          collected: false,
          type: "crystal",
        },
      ],
      doors: [
        { x: 50, y: 250, width: 60, height: 80, to: "hallway", locked: false },
      ],
      ghosts: [
        { x: 500, y: 100, radius: 30, speed: 0.5, direction: 1, active: true },
      ],
    },
  ]);

  const currentRoom = useRef("entrance");
  const inventory = useRef([]);
  const gameTimer = useRef(0);
  const clickTarget = useRef(null);

  // Initialize game
  const initGame = useCallback(() => {
    player.current = {
      x: 100,
      y: 350,
      width: 30,
      height: 40,
      speed: 3,
      moving: false,
      targetX: 100,
      targetY: 350,
    };

    currentRoom.current = "entrance";
    inventory.current = [];
    gameTimer.current = 0;
    clickTarget.current = null;

    // Reset all rooms
    rooms.current.forEach((room) => {
      room.items.forEach((item) => (item.collected = false));
      room.ghosts.forEach((ghost) => (ghost.active = true));
    });

    // Lock library initially
    const hallway = rooms.current.find((r) => r.id === "hallway");
    if (hallway) {
      const libraryDoor = hallway.doors.find((d) => d.to === "library");
      if (libraryDoor) libraryDoor.locked = true;
    }
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

  // Distance calculation
  const getDistance = (obj1, obj2) => {
    const dx = obj1.x + obj1.width / 2 - (obj2.x + obj2.radius);
    const dy = obj1.y + obj1.height / 2 - (obj2.y + obj2.radius);
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle canvas click/touch
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

      const room = rooms.current.find((r) => r.id === currentRoom.current);
      if (!room) return;

      // Check if clicking on items
      for (let item of room.items) {
        if (
          !item.collected &&
          clickX >= item.x &&
          clickX <= item.x + item.width &&
          clickY >= item.y &&
          clickY <= item.y + item.height
        ) {
          // Check if player is close enough
          const distance = Math.sqrt(
            Math.pow(
              player.current.x +
                player.current.width / 2 -
                (item.x + item.width / 2),
              2
            ) +
              Math.pow(
                player.current.y +
                  player.current.height / 2 -
                  (item.y + item.height / 2),
                2
              )
          );

          if (distance < 60) {
            item.collected = true;
            inventory.current.push(item);

            // Unlock library if player has key
            if (item.type === "key") {
              const hallway = rooms.current.find((r) => r.id === "hallway");
              if (hallway) {
                const libraryDoor = hallway.doors.find(
                  (d) => d.to === "library"
                );
                if (libraryDoor) libraryDoor.locked = false;
              }
            }

            setInternalGameState((prev) => {
              const newState = { ...prev, score: prev.score + 20 };
              onGameStateChange?.(newState);
              return newState;
            });
            return;
          } else {
            // Move player towards item
            player.current.targetX = item.x - player.current.width / 2;
            player.current.targetY = item.y;
            player.current.moving = true;
            return;
          }
        }
      }

      // Check if clicking on doors
      for (let door of room.doors) {
        if (
          clickX >= door.x &&
          clickX <= door.x + door.width &&
          clickY >= door.y &&
          clickY <= door.y + door.height
        ) {
          if (door.locked) {
            return; // Can't use locked door
          }

          // Check if player is close enough
          const distance = Math.sqrt(
            Math.pow(
              player.current.x +
                player.current.width / 2 -
                (door.x + door.width / 2),
              2
            ) +
              Math.pow(
                player.current.y +
                  player.current.height / 2 -
                  (door.y + door.height / 2),
                2
              )
          );

          if (distance < 60) {
            currentRoom.current = door.to;
            player.current.x = 100;
            player.current.y = 350;
            player.current.moving = false;
            return;
          } else {
            // Move player towards door
            player.current.targetX = door.x - player.current.width / 2;
            player.current.targetY =
              door.y + door.height - player.current.height;
            player.current.moving = true;
            return;
          }
        }
      }

      // Otherwise, move player to clicked location
      player.current.targetX = Math.max(
        0,
        Math.min(
          clickX - player.current.width / 2,
          canvas.width - player.current.width
        )
      );
      player.current.targetY = Math.max(
        200,
        Math.min(
          clickY - player.current.height / 2,
          canvas.height - player.current.height - 50
        )
      );
      player.current.moving = true;

      e.preventDefault();
    },
    [internalGameState.gameRunning, onGameStateChange]
  );

  // Game update loop
  const updateGame = useCallback(() => {
    if (!internalGameState.gameRunning) return;

    gameTimer.current++;

    // Update player movement
    if (player.current.moving) {
      const dx = player.current.targetX - player.current.x;
      const dy = player.current.targetY - player.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < player.current.speed) {
        player.current.x = player.current.targetX;
        player.current.y = player.current.targetY;
        player.current.moving = false;
      } else {
        player.current.x += (dx / distance) * player.current.speed;
        player.current.y += (dy / distance) * player.current.speed;
      }
    }

    const room = rooms.current.find((r) => r.id === currentRoom.current);
    if (!room) return;

    // Update ghosts
    room.ghosts.forEach((ghost) => {
      if (!ghost.active) return;

      ghost.x += ghost.speed * ghost.direction;

      // Bounce off walls
      if (ghost.x <= ghost.radius || ghost.x >= 800 - ghost.radius) {
        ghost.direction *= -1;
      }

      // Check collision with player
      const distance = getDistance(player.current, ghost);
      if (distance < ghost.radius + 20) {
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
        player.current.x = 100;
        player.current.y = 350;
        player.current.moving = false;
      }
    });

    // Check win condition (collect crystal in library)
    if (currentRoom.current === "library") {
      const crystal = room.items.find(
        (item) => item.type === "crystal" && item.collected
      );
      if (crystal) {
        setInternalGameState((prev) => {
          const newState = { ...prev, gameWon: true, gameRunning: false };
          onGameStateChange?.(newState);
          return newState;
        });
      }
    }

    // Time bonus points
    if (gameTimer.current % 180 === 0) {
      // Every 3 seconds
      setInternalGameState((prev) => {
        const newState = { ...prev, score: prev.score + 1 };
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
    const room = rooms.current.find((r) => r.id === currentRoom.current);
    if (!room) return;

    // Clear canvas with room background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, room.background);
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw floor
    ctx.fillStyle = "#2d2d44";
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Draw walls with spooky patterns
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height - 50);
      ctx.stroke();
    }

    // Draw doors
    room.doors.forEach((door) => {
      ctx.fillStyle = door.locked ? "#8B4513" : "#654321";
      ctx.shadowColor = door.locked ? "#ff4444" : "#00ff88";
      ctx.shadowBlur = door.locked ? 5 : 10;
      ctx.fillRect(door.x, door.y, door.width, door.height);

      // Door handle
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(
        door.x + door.width - 10,
        door.y + door.height / 2,
        3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Lock indicator
      if (door.locked) {
        ctx.fillStyle = "#ff4444";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("🔒", door.x + door.width / 2, door.y - 10);
      }
    });

    // Draw items
    room.items.forEach((item) => {
      if (item.collected) return;

      ctx.shadowBlur = 15;
      switch (item.type) {
        case "key":
          ctx.fillStyle = "#FFD700";
          ctx.shadowColor = "#FFD700";
          ctx.fillRect(item.x, item.y, item.width, item.height);
          break;
        case "candle":
          ctx.fillStyle = "#FFA500";
          ctx.shadowColor = "#FFA500";
          ctx.fillRect(item.x, item.y, item.width, item.height);
          // Flame
          ctx.fillStyle = "#FF4500";
          ctx.beginPath();
          ctx.arc(item.x + item.width / 2, item.y - 5, 3, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "gem":
          ctx.fillStyle = "#9932CC";
          ctx.shadowColor = "#9932CC";
          ctx.beginPath();
          ctx.arc(
            item.x + item.width / 2,
            item.y + item.height / 2,
            item.width / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
          break;
        case "book":
          ctx.fillStyle = "#8B4513";
          ctx.shadowColor = "#8B4513";
          ctx.fillRect(item.x, item.y, item.width, item.height);
          break;
        case "scroll":
          ctx.fillStyle = "#F5DEB3";
          ctx.shadowColor = "#F5DEB3";
          ctx.fillRect(item.x, item.y, item.width, item.height);
          break;
        case "crystal":
          ctx.fillStyle = "#00FFFF";
          ctx.shadowColor = "#00FFFF";
          ctx.beginPath();
          ctx.arc(
            item.x + item.width / 2,
            item.y + item.height / 2,
            item.width / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
          break;
      }
      ctx.shadowBlur = 0;
    });

    // Draw ghosts
    room.ghosts.forEach((ghost) => {
      if (!ghost.active) return;

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(ghost.x, ghost.y, ghost.radius, 0, Math.PI * 2);
      ctx.fill();

      // Ghost eyes
      ctx.fillStyle = "#ff4444";
      ctx.beginPath();
      ctx.arc(ghost.x - 8, ghost.y - 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ghost.x + 8, ghost.y - 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw player
    ctx.fillStyle = "#4169E1";
    ctx.shadowColor = "#4169E1";
    ctx.shadowBlur = 10;
    ctx.fillRect(
      player.current.x,
      player.current.y,
      player.current.width,
      player.current.height
    );

    // Player face
    ctx.fillStyle = "#FFE4C4";
    ctx.fillRect(player.current.x + 5, player.current.y + 5, 20, 15);

    // Eyes
    ctx.fillStyle = "#000";
    ctx.fillRect(player.current.x + 8, player.current.y + 8, 2, 2);
    ctx.fillRect(player.current.x + 15, player.current.y + 8, 2, 2);
    ctx.shadowBlur = 0;

    // Draw room name
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.fillText(room.name, canvas.width / 2, 30);

    // Draw inventory
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(10, 50, 200, 30);
    ctx.strokeStyle = "#888";
    ctx.strokeRect(10, 50, 200, 30);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.fillText("Inventory: " + inventory.current.length + " items", 15, 70);
  }, []);

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

  // Event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("touchstart", handleCanvasClick, {
      passive: false,
    });

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("touchstart", handleCanvasClick);
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
          boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          touchAction: "manipulation",
        }}
      />

      {/* Instructions */}
      <div className="mt-4 text-center text-gray-400 text-sm max-w-md">
        <p>
          Click/tap to move and interact with objects. Avoid ghosts, collect
          items, and find the crystal!
        </p>
        <p className="mt-1 text-xs">
          🗝️ Find the key to unlock new rooms • 💎 Collect the crystal to win
        </p>
      </div>
    </div>
  );
};

export default HauntedManor;
