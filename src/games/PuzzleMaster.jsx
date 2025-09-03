import React, { useState, useEffect, useCallback, useRef } from "react";

const PuzzleMaster = ({ isPlaying, isPaused, onGameStateChange }) => {
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
  const currentPuzzle = useRef("memory");
  const timeLeft = useRef(30);
  const gameTimer = useRef(0);

  // Memory Game State
  const memoryGrid = useRef([]);
  const memoryRevealed = useRef([]);
  const memoryMatched = useRef([]);
  const memorySelected = useRef([]);
  const memoryGridSize = useRef(4);

  // Pattern Game State
  const patternSequence = useRef([]);
  const playerSequence = useRef([]);
  const patternShowing = useRef(false);
  const patternIndex = useRef(0);

  // Math Game State
  const mathProblem = useRef({
    num1: 0,
    num2: 0,
    operator: "+",
    answer: 0,
    userAnswer: "",
    options: [],
  });

  // Color Game State
  const colorTarget = useRef({ r: 0, g: 0, b: 0 });
  const colorOptions = useRef([]);
  const colorSelected = useRef(null);

  // Puzzle types
  const puzzleTypes = ["memory", "pattern", "math", "color"];

  // Initialize memory game
  const initMemoryGame = useCallback(() => {
    const size = memoryGridSize.current;
    const totalPairs = (size * size) / 2;
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
    ];

    const pairs = [];
    for (let i = 0; i < totalPairs; i++) {
      pairs.push(colors[i % colors.length], colors[i % colors.length]);
    }

    // Shuffle the pairs
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    memoryGrid.current = pairs;
    memoryRevealed.current = new Array(size * size).fill(false);
    memoryMatched.current = new Array(size * size).fill(false);
    memorySelected.current = [];
  }, []);

  // Initialize pattern game
  const initPatternGame = useCallback(() => {
    patternSequence.current = [];
    playerSequence.current = [];
    patternShowing.current = false;
    patternIndex.current = 0;

    // Create random pattern
    const length = 3 + Math.floor(internalGameState.level / 2);
    for (let i = 0; i < length; i++) {
      patternSequence.current.push(Math.floor(Math.random() * 4));
    }
  }, [internalGameState.level]);

  // Initialize math game
  const initMathGame = useCallback(() => {
    const operators = ["+", "-", "*"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 20) + 1;

    if (operator === "-" && num1 < num2) {
      [num1, num2] = [num2, num1];
    }

    let answer;
    switch (operator) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
    }

    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 10) - 5;
      if (!options.includes(wrongAnswer) && wrongAnswer >= 0) {
        options.push(wrongAnswer);
      }
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    mathProblem.current = {
      num1,
      num2,
      operator,
      answer,
      userAnswer: "",
      options,
    };
  }, []);

  // Initialize color game
  const initColorGame = useCallback(() => {
    colorTarget.current = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    };

    colorOptions.current = [colorTarget.current];

    // Add similar colors as options
    for (let i = 0; i < 3; i++) {
      colorOptions.current.push({
        r: Math.max(
          0,
          Math.min(255, colorTarget.current.r + (Math.random() - 0.5) * 100)
        ),
        g: Math.max(
          0,
          Math.min(255, colorTarget.current.g + (Math.random() - 0.5) * 100)
        ),
        b: Math.max(
          0,
          Math.min(255, colorTarget.current.b + (Math.random() - 0.5) * 100)
        ),
      });
    }

    // Shuffle options
    for (let i = colorOptions.current.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorOptions.current[i], colorOptions.current[j]] = [
        colorOptions.current[j],
        colorOptions.current[i],
      ];
    }

    colorSelected.current = null;
  }, []);

  // Initialize current puzzle
  const initCurrentPuzzle = useCallback(() => {
    timeLeft.current = 30 + internalGameState.level * 5;

    switch (currentPuzzle.current) {
      case "memory":
        initMemoryGame();
        break;
      case "pattern":
        initPatternGame();
        break;
      case "math":
        initMathGame();
        break;
      case "color":
        initColorGame();
        break;
    }
  }, [
    internalGameState.level,
    initMemoryGame,
    initPatternGame,
    initMathGame,
    initColorGame,
  ]);

  // Initialize game
  const initGame = useCallback(() => {
    currentPuzzle.current =
      puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
    gameTimer.current = 0;
    initCurrentPuzzle();
  }, [initCurrentPuzzle]);

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

      // Handle clicks based on current puzzle
      switch (currentPuzzle.current) {
        case "memory":
          handleMemoryClick(clickX, clickY);
          break;
        case "pattern":
          handlePatternClick(clickX, clickY);
          break;
        case "math":
          handleMathClick(clickX, clickY);
          break;
        case "color":
          handleColorClick(clickX, clickY);
          break;
      }

      e.preventDefault();
    },
    [internalGameState.gameRunning]
  );

  // Memory game click handler
  const handleMemoryClick = (x, y) => {
    const size = memoryGridSize.current;
    const cellSize = 80;
    const startX = 400 - (size * cellSize) / 2;
    const startY = 150;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cellX = startX + col * cellSize;
        const cellY = startY + row * cellSize;
        const index = row * size + col;

        if (
          x >= cellX &&
          x <= cellX + cellSize - 10 &&
          y >= cellY &&
          y <= cellY + cellSize - 10
        ) {
          if (memoryRevealed.current[index] || memoryMatched.current[index])
            return;
          if (memorySelected.current.length >= 2) return;

          memoryRevealed.current[index] = true;
          memorySelected.current.push(index);

          if (memorySelected.current.length === 2) {
            const [first, second] = memorySelected.current;
            if (memoryGrid.current[first] === memoryGrid.current[second]) {
              memoryMatched.current[first] = true;
              memoryMatched.current[second] = true;
              memorySelected.current = [];

              // Check if all matched
              if (memoryMatched.current.every((matched) => matched)) {
                completePuzzle();
              }
            } else {
              setTimeout(() => {
                memoryRevealed.current[first] = false;
                memoryRevealed.current[second] = false;
                memorySelected.current = [];
              }, 1000);
            }
          }
          break;
        }
      }
    }
  };

  // Pattern game click handler
  const handlePatternClick = (x, y) => {
    if (patternShowing.current) return;

    const buttons = [
      { x: 300, y: 200, color: "#ff6b6b" },
      { x: 450, y: 200, color: "#4ecdc4" },
      { x: 300, y: 300, color: "#45b7d1" },
      { x: 450, y: 300, color: "#feca57" },
    ];

    buttons.forEach((button, index) => {
      if (
        x >= button.x &&
        x <= button.x + 80 &&
        y >= button.y &&
        y <= button.y + 80
      ) {
        playerSequence.current.push(index);

        if (playerSequence.current.length === patternSequence.current.length) {
          let correct = true;
          for (let i = 0; i < patternSequence.current.length; i++) {
            if (playerSequence.current[i] !== patternSequence.current[i]) {
              correct = false;
              break;
            }
          }

          if (correct) {
            completePuzzle();
          } else {
            failPuzzle();
          }
        } else if (
          playerSequence.current[playerSequence.current.length - 1] !==
          patternSequence.current[playerSequence.current.length - 1]
        ) {
          failPuzzle();
        }
      }
    });
  };

  // Math game click handler
  const handleMathClick = (x, y) => {
    const buttonWidth = 120;
    const buttonHeight = 40;
    const startX = 400 - (2 * buttonWidth + 20) / 2;
    const startY = 300;

    mathProblem.current.options.forEach((option, index) => {
      const buttonX = startX + (index % 2) * (buttonWidth + 20);
      const buttonY = startY + Math.floor(index / 2) * (buttonHeight + 10);

      if (
        x >= buttonX &&
        x <= buttonX + buttonWidth &&
        y >= buttonY &&
        y <= buttonY + buttonHeight
      ) {
        if (option === mathProblem.current.answer) {
          completePuzzle();
        } else {
          failPuzzle();
        }
      }
    });
  };

  // Color game click handler
  const handleColorClick = (x, y) => {
    const buttonSize = 80;
    const startX = 400 - (2 * buttonSize + 20) / 2;
    const startY = 280;

    colorOptions.current.forEach((color, index) => {
      const buttonX = startX + (index % 2) * (buttonSize + 20);
      const buttonY = startY + Math.floor(index / 2) * (buttonSize + 10);

      if (
        x >= buttonX &&
        x <= buttonX + buttonSize &&
        y >= buttonY &&
        y <= buttonY + buttonSize
      ) {
        if (color === colorTarget.current) {
          completePuzzle();
        } else {
          failPuzzle();
        }
      }
    });
  };

  // Complete puzzle
  const completePuzzle = () => {
    const bonus = Math.floor(timeLeft.current * 2);
    setInternalGameState((prev) => {
      const newState = {
        ...prev,
        score: prev.score + 100 + bonus,
        level: prev.level + 1,
      };
      onGameStateChange?.(newState);
      return newState;
    });

    // Next puzzle
    setTimeout(() => {
      currentPuzzle.current =
        puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
      initCurrentPuzzle();
    }, 1000);
  };

  // Fail puzzle
  const failPuzzle = () => {
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

    if (internalGameState.lives > 1) {
      setTimeout(() => {
        initCurrentPuzzle();
      }, 1000);
    }
  };

  // Game update loop
  const updateGame = useCallback(() => {
    if (!internalGameState.gameRunning) return;

    gameTimer.current++;

    // Update timer
    if (gameTimer.current % 60 === 0) {
      // Every second
      timeLeft.current--;
      if (timeLeft.current <= 0) {
        failPuzzle();
      }
    }

    // Pattern sequence display
    if (currentPuzzle.current === "pattern" && patternShowing.current) {
      if (gameTimer.current % 90 === 0) {
        // Show each color for 1.5 seconds
        patternIndex.current++;
        if (patternIndex.current >= patternSequence.current.length) {
          patternShowing.current = false;
          patternIndex.current = 0;
        }
      }
    }
  }, [internalGameState.gameRunning, internalGameState.lives]);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas with puzzle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title and timer
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Puzzle Master", canvas.width / 2, 40);

    ctx.font = "18px Arial";
    ctx.fillText(
      `${currentPuzzle.current.toUpperCase()} PUZZLE`,
      canvas.width / 2,
      70
    );

    // Timer with warning color
    ctx.fillStyle = timeLeft.current <= 10 ? "#ff4444" : "#00ff88";
    ctx.fillText(`Time: ${timeLeft.current}s`, canvas.width / 2, 100);

    // Render current puzzle
    switch (currentPuzzle.current) {
      case "memory":
        renderMemoryGame(ctx);
        break;
      case "pattern":
        renderPatternGame(ctx);
        break;
      case "math":
        renderMathGame(ctx);
        break;
      case "color":
        renderColorGame(ctx);
        break;
    }
  }, []);

  // Render memory game
  const renderMemoryGame = (ctx) => {
    const size = memoryGridSize.current;
    const cellSize = 80;
    const startX = 400 - (size * cellSize) / 2;
    const startY = 150;

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Match the colored pairs!", 400, 130);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;
        const index = row * size + col;

        if (memoryMatched.current[index]) {
          ctx.fillStyle = "#555555";
        } else if (memoryRevealed.current[index]) {
          ctx.fillStyle = memoryGrid.current[index];
          ctx.shadowColor = memoryGrid.current[index];
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = "#333333";
        }

        ctx.fillRect(x, y, cellSize - 10, cellSize - 10);
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellSize - 10, cellSize - 10);
      }
    }
  };

  // Render pattern game
  const renderPatternGame = (ctx) => {
    const buttons = [
      { x: 300, y: 200, color: "#ff6b6b" },
      { x: 450, y: 200, color: "#4ecdc4" },
      { x: 300, y: 300, color: "#45b7d1" },
      { x: 450, y: 300, color: "#feca57" },
    ];

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    if (patternShowing.current) {
      ctx.fillText("Watch the pattern!", 400, 180);
    } else {
      ctx.fillText("Repeat the pattern!", 400, 180);
    }

    buttons.forEach((button, index) => {
      let fillColor = button.color;
      let glowing = false;

      // Highlight if showing pattern
      if (
        patternShowing.current &&
        patternIndex.current < patternSequence.current.length
      ) {
        if (index === patternSequence.current[patternIndex.current]) {
          fillColor = "#ffffff";
          glowing = true;
        }
      }

      ctx.fillStyle = fillColor;
      if (glowing) {
        ctx.shadowColor = fillColor;
        ctx.shadowBlur = 20;
      }
      ctx.fillRect(button.x, button.y, 80, 80);
      ctx.shadowBlur = 0;

      // Button border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(button.x, button.y, 80, 80);
    });

    // Show progress
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText(
      `${playerSequence.current.length}/${patternSequence.current.length}`,
      400,
      420
    );
  };

  // Render math game
  const renderMathGame = (ctx) => {
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Solve the equation!", 400, 180);

    // Draw equation
    ctx.font = "32px Arial";
    const equation = `${mathProblem.current.num1} ${mathProblem.current.operator} ${mathProblem.current.num2} = ?`;
    ctx.fillText(equation, 400, 250);

    // Draw answer options
    const buttonWidth = 120;
    const buttonHeight = 40;
    const startX = 400 - (2 * buttonWidth + 20) / 2;
    const startY = 300;

    mathProblem.current.options.forEach((option, index) => {
      const buttonX = startX + (index % 2) * (buttonWidth + 20);
      const buttonY = startY + Math.floor(index / 2) * (buttonHeight + 10);

      ctx.fillStyle = "#4a90e2";
      ctx.shadowColor = "#4a90e2";
      ctx.shadowBlur = 10;
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

      ctx.fillStyle = "#ffffff";
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        option.toString(),
        buttonX + buttonWidth / 2,
        buttonY + buttonHeight / 2 + 6
      );
    });
  };

  // Render color game
  const renderColorGame = (ctx) => {
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Match the target color!", 400, 180);

    // Draw target color
    const targetColor = `rgb(${colorTarget.current.r}, ${colorTarget.current.g}, ${colorTarget.current.b})`;
    ctx.fillStyle = targetColor;
    ctx.shadowColor = targetColor;
    ctx.shadowBlur = 15;
    ctx.fillRect(350, 200, 100, 60);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(350, 200, 100, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText("TARGET", 400, 195);

    // Draw color options
    const buttonSize = 80;
    const startX = 400 - (2 * buttonSize + 20) / 2;
    const startY = 280;

    colorOptions.current.forEach((color, index) => {
      const buttonX = startX + (index % 2) * (buttonSize + 20);
      const buttonY = startY + Math.floor(index / 2) * (buttonSize + 10);

      const colorStr = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillStyle = colorStr;
      ctx.shadowColor = colorStr;
      ctx.shadowBlur = 10;
      ctx.fillRect(buttonX, buttonY, buttonSize, buttonSize);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(buttonX, buttonY, buttonSize, buttonSize);
    });
  };

  // Handle parent control changes
  useEffect(() => {
    if (isPlaying && !isPaused) {
      if (!internalGameState.gameRunning && !internalGameState.gameOver) {
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
    internalGameState.gameRunning,
  ]);

  // Start pattern sequence when pattern game loads
  useEffect(() => {
    if (currentPuzzle.current === "pattern" && internalGameState.gameRunning) {
      patternShowing.current = true;
      patternIndex.current = 0;
      playerSequence.current = [];
    }
  }, [currentPuzzle.current, internalGameState.gameRunning]);

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
        className="max-w-full max-h-full border-2 border-purple-400 rounded-lg shadow-lg cursor-pointer touch-none"
        style={{
          boxShadow: "0 0 20px rgba(139, 69, 19, 0.5)",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          touchAction: "manipulation",
        }}
      />

      {/* Instructions */}
      <div className="mt-4 text-center text-gray-400 text-sm max-w-md">
        <p className="mb-2">Complete puzzles before time runs out!</p>
        <div className="text-xs space-y-1">
          <p>🧠 MEMORY: Match colored pairs</p>
          <p>🎵 PATTERN: Repeat the sequence</p>
          <p>➕ MATH: Solve the equation</p>
          <p>🎨 COLOR: Match the target color</p>
        </div>
      </div>
    </div>
  );
};

export default PuzzleMaster;
