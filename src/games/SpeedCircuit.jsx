import React, { useRef, useEffect, useState } from "react";
import { Gauge, Flag, RefreshCw } from "lucide-react";

// SpeedCircuit Game component
const SpeedCircuit = () => {
  const canvasRef = useRef(null);
  const [laps, setLaps] = useState(0);
  const [gameMessage, setGameMessage] = useState("");
  const [speed, setSpeed] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Refs for game data to avoid re-renders
  const car = useRef({
    x: 100,
    y: 150,
    width: 20,
    height: 30,
    angle: -Math.PI / 2, // Initial angle pointing up
    speed: 0,
    acceleration: 0.1,
    maxSpeed: 5,
    friction: 0.05,
    turnSpeed: 0.04,
  });
  const keys = useRef({});
  const checkpoints = useRef([]);
  const currentCheckpoint = useRef(0);
  const trackWidth = 80;

  // Colors based on a sci-fi theme
  const colors = {
    background: "#0f172a",
    track: "#334155",
    trackOutline: "#1e293b",
    car: "#d946ef",
    carOutline: "#bf00ff",
    checkpoint: "#00ffff",
    textPrimary: "#f8fafc",
    textSecondary: "#cbd5e1",
    primary: "#0ea5e9",
    accent: "#d946ef",
  };

  // Game loop
  const gameLoop = () => {
    if (gameOver) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Update car position based on input
    updateCar();

    // Check for collisions and checkpoints
    checkCollisions(canvas);

    // Drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx, canvas);

    requestAnimationFrame(gameLoop);
  };

  // Update car physics
  const updateCar = () => {
    const k = keys.current;
    const c = car.current;

    // Apply acceleration/braking
    if (k.ArrowUp || k.w) {
      c.speed += c.acceleration;
    }
    if (k.ArrowDown || k.s) {
      c.speed -= c.acceleration;
    }

    // Apply friction
    if (c.speed > 0) {
      c.speed = Math.max(0, c.speed - c.friction);
    } else if (c.speed < 0) {
      c.speed = Math.min(0, c.speed + c.friction);
    }

    // Clamp speed
    c.speed = Math.min(Math.abs(c.speed), c.maxSpeed) * Math.sign(c.speed);

    // Apply turning
    if (c.speed !== 0) {
      const turnFactor = Math.abs(c.speed) / c.maxSpeed;
      if (k.ArrowLeft || k.a) {
        c.angle -= c.turnSpeed * turnFactor;
      }
      if (k.ArrowRight || k.d) {
        c.angle += c.turnSpeed * turnFactor;
      }
    }

    // Update position
    c.x += Math.sin(c.angle) * c.speed;
    c.y += Math.cos(c.angle) * c.speed;

    setSpeed(Math.abs(c.speed).toFixed(1));
  };

  // Check if car is on the track and if checkpoints are hit
  const checkCollisions = (canvas) => {
    const c = car.current;

    // Geometric collision detection for track
    const onOuterTrack =
      c.x > 100 &&
      c.x < canvas.width - 100 &&
      c.y > 100 &&
      c.y < canvas.height - 100;
    const onInnerTrack =
      c.x > 100 + trackWidth &&
      c.x < canvas.width - 100 - trackWidth &&
      c.y > 100 + trackWidth &&
      c.y < canvas.height - 100 - trackWidth;

    if (!(onOuterTrack && !onInnerTrack)) {
      // Handle off-road friction
      car.current.speed *= 0.95;
    }

    // Checkpoints and laps
    const currentCheckpointPos = checkpoints.current[currentCheckpoint.current];
    if (
      currentCheckpointPos &&
      Math.hypot(c.x - currentCheckpointPos.x, c.y - currentCheckpointPos.y) <
        50
    ) {
      if (currentCheckpoint.current === checkpoints.current.length - 1) {
        setLaps((prevLaps) => prevLaps + 1);
        currentCheckpoint.current = 0;
        setGameMessage(`Lap ${laps + 1} completed!`);
      } else {
        currentCheckpoint.current += 1;
        setGameMessage(`Checkpoint ${currentCheckpoint.current} reached!`);
      }
    }
  };

  // Drawing game elements
  const draw = (ctx, canvas) => {
    // Redraw the track first
    drawTrack(ctx, canvas);

    // Draw checkpoints
    drawCheckpoints(ctx);

    // Draw the car
    drawCar(ctx);
  };

  // Draw the racetrack
  const drawTrack = (ctx, canvas) => {
    // Generate checkpoints on first draw
    if (checkpoints.current.length === 0) {
      checkpoints.current = [
        { x: 100 + trackWidth / 2, y: 100 + 50 }, // Start line
        { x: canvas.width - 100 - trackWidth / 2, y: 100 + trackWidth / 2 },
        {
          x: canvas.width - 100 - trackWidth / 2,
          y: canvas.height - 100 - trackWidth / 2,
        },
        { x: 100 + trackWidth / 2, y: canvas.height - 100 - trackWidth / 2 },
      ];
    }

    // Draw the outer track rectangle
    ctx.fillStyle = colors.track;
    ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);

    // Draw the inner "hole" to form the track
    ctx.fillStyle = colors.background;
    ctx.fillRect(
      100 + trackWidth,
      100 + trackWidth,
      canvas.width - 200 - 2 * trackWidth,
      canvas.height - 200 - 2 * trackWidth
    );

    // Draw start/finish line
    ctx.strokeStyle = "#f8fafc";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(100 + trackWidth / 2, 100);
    ctx.lineTo(100 + trackWidth / 2, 100 + trackWidth);
    ctx.stroke();
  };

  // Draw checkpoints
  const drawCheckpoints = (ctx) => {
    ctx.fillStyle = colors.checkpoint;
    ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
    ctx.lineWidth = 5;
    checkpoints.current.forEach((p, index) => {
      // Draw only the current checkpoint
      if (index === currentCheckpoint.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });
  };

  // Draw the player's car
  const drawCar = (ctx) => {
    const c = car.current;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.angle);
    ctx.fillStyle = colors.car;
    ctx.strokeStyle = colors.carOutline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-c.width / 2, -c.height / 2, c.width, c.height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  // Set up event listeners and game loop on mount
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current = { ...keys.current, [e.key]: true };
    };

    const handleKeyUp = (e) => {
      keys.current = { ...keys.current, [e.key]: false };
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Initial position for the car
    const canvas = canvasRef.current;
    if (canvas) {
      car.current.x = 100 + trackWidth / 2;
      car.current.y = 100 + 50;
    }

    const animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [laps, gameOver]); // Dependencies to restart loop if necessary

  const restartRace = () => {
    setGameOver(false);
    setLaps(0);
    car.current = {
      ...car.current,
      x: 100 + trackWidth / 2,
      y: 100 + 50,
      angle: -Math.PI / 2,
      speed: 0,
    };
    currentCheckpoint.current = 0;
    setGameMessage("");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
      style={{ backgroundColor: colors.background, color: colors.textPrimary }}
    >
      <div
        className="game-container w-full max-w-5xl flex flex-col items-center p-8 rounded-xl border-2 border-primary bg-[#1e293b]"
        style={{
          boxShadow: `0 0 30px ${colors.primary}, 0 0 10px ${colors.accent}`,
        }}
      >
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            SpeedCircuit
          </h1>
          <div className="flex items-center space-x-8 mt-4 text-textSecondary">
            <span className="flex items-center space-x-2">
              <Flag className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">{laps}</span>
            </span>
            <span className="flex items-center space-x-2">
              <Gauge className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">{speed} kph</span>
            </span>
          </div>
          <p
            className="mt-4 text-center text-lg font-bold"
            style={{ color: colors.textPrimary }}
          >
            {gameMessage}
          </p>
        </div>

        <canvas
          ref={canvasRef}
          width="800"
          height="600"
          className="border-2 rounded-md"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.background,
          }}
        ></canvas>

        <div
          className="mt-8 text-center"
          style={{ color: colors.textSecondary }}
        >
          {gameOver ? (
            <button
              onClick={restartRace}
              className="px-6 py-3 text-lg font-semibold rounded-full text-white bg-gradient-to-r from-accent to-primary transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 mr-2 inline-block" />
              Restart Race
            </button>
          ) : (
            <>
              <p>
                Use the <span className="font-bold">Arrow Keys</span> or{" "}
                <span className="font-bold">WASD</span> to drive.
              </p>
              <p className="text-sm mt-1">
                Stay on the track! Hit the glowing checkpoints in order to
                complete a lap.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeedCircuit;
