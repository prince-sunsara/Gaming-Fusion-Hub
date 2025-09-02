import React, { useState, useEffect, useCallback } from "react";

// Symbol data for the tiles, using a gaming/sci-fi theme
const symbols = [
  "⚡",
  "🔮",
  "👾",
  "💎",
  "🧩",
  "⚙️",
  "🧪",
  "🚀",
  "⚡",
  "🔮",
  "👾",
  "💎",
  "🧩",
  "⚙️",
  "🧪",
  "🚀",
];

// Shuffle array function
const shuffleArray = (array) => {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// PuzzleMaster Component
const PuzzleMaster = () => {
  const [gameState, setGameState] = useState({
    tiles: [],
    flipped: [],
    matched: [],
    score: 0,
    moves: 0,
    timer: 0,
    gameStarted: false,
    gameWon: false,
  });

  const [canFlip, setCanFlip] = useState(true);

  // Initialize the game board
  const initGame = useCallback(() => {
    const shuffledTiles = shuffleArray(symbols).map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
    setGameState({
      tiles: shuffledTiles,
      flipped: [],
      matched: [],
      score: 0,
      moves: 0,
      timer: 0,
      gameStarted: true,
      gameWon: false,
    });
    setCanFlip(true);
  }, []);

  useEffect(() => {
    let interval = null;
    if (gameState.gameStarted && !gameState.gameWon) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timer: prev.timer + 1,
        }));
      }, 1000);
    } else if (!gameState.gameStarted || gameState.gameWon) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState.gameStarted, gameState.gameWon]);

  const handleTileClick = (clickedTile) => {
    if (!canFlip || clickedTile.isFlipped || clickedTile.isMatched) {
      return;
    }

    const newTiles = gameState.tiles.map((tile) =>
      tile.id === clickedTile.id ? { ...tile, isFlipped: true } : tile
    );

    const newFlipped = [...gameState.flipped, clickedTile];

    setGameState((prev) => ({
      ...prev,
      tiles: newTiles,
      flipped: newFlipped,
      moves: prev.moves + 1,
    }));
  };

  useEffect(() => {
    if (gameState.flipped.length === 2) {
      setCanFlip(false);
      const [tile1, tile2] = gameState.flipped;
      if (tile1.symbol === tile2.symbol) {
        // Match found
        const newMatched = [...gameState.matched, tile1.symbol];
        setGameState((prev) => ({
          ...prev,
          matched: newMatched,
          flipped: [],
          score: prev.score + 10,
        }));
      } else {
        // No match, flip them back
        setTimeout(() => {
          const newTiles = gameState.tiles.map((tile) =>
            tile.id === tile1.id || tile.id === tile2.id
              ? { ...tile, isFlipped: false }
              : tile
          );
          setGameState((prev) => ({
            ...prev,
            tiles: newTiles,
            flipped: [],
          }));
        }, 1000);
      }
      setTimeout(() => setCanFlip(true), 1000);
    }
  }, [gameState.flipped, gameState.tiles]);

  useEffect(() => {
    if (
      gameState.matched.length === symbols.length / 2 &&
      gameState.gameStarted
    ) {
      setGameState((prev) => ({ ...prev, gameWon: true }));
    }
  }, [gameState.matched, gameState.gameStarted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const getBackgroundColor = (isFlipped, isMatched) => {
    if (isMatched) return "bg-neon-green/30 border-neon-green";
    if (isFlipped) return "bg-primary/20 border-primary";
    return "bg-backgroundTertiary hover:bg-backgroundSecondary transition-all duration-300";
  };

  const getShadowColor = (isFlipped, isMatched) => {
    if (isMatched) return "shadow-[0_0_15px_#39ff14]";
    if (isFlipped) return "shadow-[0_0_15px_#0ea5e9]";
    return "";
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div className="text-center mb-8">
        <h1
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, #0ea5e9, #d946ef)`,
          }}
        >
          Puzzle Master
        </h1>
        <p className="mt-2 text-textSecondary text-lg">
          Match the glowing symbols to win!
        </p>
      </div>

      {!gameState.gameStarted && !gameState.gameWon ? (
        <div
          className="flex flex-col items-center p-8 bg-backgroundSecondary border border-primary/20 rounded-xl shadow-lg"
          style={{ boxShadow: "var(--glow-primary)" }}
        >
          <p className="text-xl text-textPrimary mb-4">
            Test your memory and speed.
          </p>
          <button
            onClick={initGame}
            className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-full text-xl hover:from-primaryLight hover:to-accentLight transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(14,165,233,0.5)]"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          {/* Game UI */}
          <div
            className="w-full max-w-2xl bg-backgroundSecondary rounded-xl p-6 border border-primary/20 shadow-lg"
            style={{ boxShadow: "var(--glow-primary)" }}
          >
            <div className="flex justify-between items-center text-textPrimary mb-6 text-xl font-bold">
              <span>Score: {gameState.score}</span>
              <span>Moves: {gameState.moves}</span>
              <span>Time: {formatTime(gameState.timer)}</span>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {gameState.tiles.map((tile) => (
                <div
                  key={tile.id}
                  className={`
                    w-full h-24 sm:h-28 flex items-center justify-center rounded-lg cursor-pointer
                    border-2 transition-all duration-500 transform hover:scale-105
                    ${getBackgroundColor(tile.isFlipped, tile.isMatched)}
                    ${getShadowColor(tile.isFlipped, tile.isMatched)}
                    relative overflow-hidden
                  `}
                  onClick={() => handleTileClick(tile)}
                >
                  <div
                    className={`
                    absolute inset-0 transition-opacity duration-500
                    ${
                      tile.isFlipped || tile.isMatched
                        ? "opacity-100"
                        : "opacity-0"
                    }
                  `}
                  >
                    <p
                      className={`
                      text-4xl sm:text-5xl
                      ${
                        tile.isMatched ? "text-neon-green" : "text-primaryLight"
                      }
                      text-shadow-neon transition-colors duration-500
                    `}
                    >
                      {tile.symbol}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Win Screen */}
          {gameState.gameWon && (
            <div className="fixed inset-0 flex items-center justify-center bg-background/90 z-50">
              <div
                className="text-center p-8 bg-backgroundSecondary border border-accent/20 rounded-xl shadow-lg"
                style={{ boxShadow: "var(--glow-accent)" }}
              >
                <h2 className="text-4xl font-extrabold text-accentLight mb-4">
                  PUZZLE SOLVED!
                </h2>
                <p className="text-2xl text-textPrimary mb-2">
                  Congratulations, Master!
                </p>
                <p className="text-xl text-textSecondary mb-4">
                  Your final score: {gameState.score}
                </p>
                <p className="text-xl text-textSecondary mb-6">
                  Time: {formatTime(gameState.timer)}
                </p>
                <button
                  onClick={initGame}
                  className="px-6 py-3 bg-gradient-to-r from-accent to-primary text-white font-bold rounded-full hover:from-accentLight hover:to-primaryLight transition-all duration-300 transform hover:scale-105"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PuzzleMaster;
