// Individual Game Page with game canvas and controls
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Info,
  Star,
  Users,
  Clock,
  Volume2,
  VolumeX,
  Maximize,
  Share2,
  Heart,
  ArrowLeft,
  Gamepad2,
} from "lucide-react";
import { getGameById, getRandomGames } from "../data/games";

// Import all individual game components
import {
  BlockBreaker,
  CyberRunner,
  HauntedManor,
  NeonRacing,
  PuzzleMaster,
  ShadowAdventure,
  SpaceDefender,
  SpeedCircuit,
  TankBattle,
  ZombieSurvival,
} from "../games";

// Map game IDs to their components for dynamic rendering
const gameComponents = {
  1: NeonRacing,
  2: SpaceDefender,
  3: PuzzleMaster,
  4: ShadowAdventure,
  5: HauntedManor,
  6: CyberRunner,
  7: TankBattle,
  8: SpeedCircuit,
  9: BlockBreaker,
  10: ZombieSurvival,
};

const GamePage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [relatedGames, setRelatedGames] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    lives: 3,
    gameOver: false,
    gameWon: false,
  });

  const GameComponent = gameComponents[gameId];

  // Load game data
  useEffect(() => {
    const gameData = getGameById(gameId);
    if (gameData) {
      setGame(gameData);
      // Get related games from same category
      const related = getRandomGames(3).filter(
        (g) => g.id !== parseInt(gameId)
      );
      setRelatedGames(related);
    }
  }, [gameId]);

  const handleGameStateChange = (newGameState) => {
    setGameState({
      score: newGameState.score || 0,
      level: newGameState.level || 1,
      lives: newGameState.lives || 0,
      gameOver: newGameState.gameOver || false,
      gameWon: newGameState.gameWon || false,
    });
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setGameState({
      score: 0,
      level: 1,
      lives: 3,
      gameOver: false,
      gameWon: false,
    });
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleFullscreen = () => {
    const gameContainer = document.querySelector(".game-canvas-container");
    if (!isFullscreen && gameContainer) {
      if (gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: game.description,
        url: window.location.href,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-white mb-4">Game not found</h2>
          <Link
            to="/games"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all inline-block"
          >
            Browse Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <Link
            to="/games"
            className="hover:text-blue-300 transition-colors duration-300 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Game Library</span>
          </Link>
          <span>/</span>
          <span className="text-white">{game.title}</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="xl:col-span-2">
            {/* Game Header */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-4xl">{game.icon}</span>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {game.title}
                    </h1>
                  </div>
                  <p className="text-gray-300 mb-4">{game.description}</p>

                  {/* Game Stats */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">
                        {game.rating}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{game.players}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{game.duration}</span>
                    </div>
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                      {game.category}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      isFavorited
                        ? "text-red-400 bg-red-500/20 hover:bg-red-500/30"
                        : "text-gray-400 bg-slate-700 hover:text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-slate-700 hover:bg-slate-600 text-gray-400 hover:text-white rounded-lg transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowInfo(true)}
                    className="p-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-all duration-300"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Game Container */}
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              {/* Game Controls */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePlayPause}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold flex items-center space-x-2 hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    {!isPlaying ? (
                      <Play className="w-4 h-4" />
                    ) : isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                    <span>
                      {!isPlaying ? "Start" : isPaused ? "Resume" : "Pause"}
                    </span>
                  </button>

                  <button
                    onClick={handleRestart}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Game Settings */}
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Mute Toggle */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={handleFullscreen}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="bg-slate-700/50 p-4 border-b border-slate-600">
                  <h4 className="text-white font-semibold mb-3">
                    Game Settings
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Sound Effects</span>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                          isMuted ? "bg-gray-600" : "bg-blue-500"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                            isMuted ? "left-1" : "left-7"
                          }`}
                        ></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Auto-Pause</span>
                      <button className="relative w-12 h-6 bg-blue-500 rounded-full">
                        <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Show FPS</span>
                      <button className="relative w-12 h-6 bg-gray-600 rounded-full">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Quality</span>
                      <select className="bg-slate-600 border border-slate-500 text-white px-3 py-1 rounded text-sm">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Game Canvas or Component Area */}
              <div className="game-canvas-container relative w-full min-h-[500px] bg-gradient-to-br from-slate-900 to-slate-800">
                {/* Dynamically render the correct game component */}
                {GameComponent && (
                  <GameComponent
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    onGameStateChange={handleGameStateChange}
                  />
                )}

                {/* Game Overlay UI - Only show if game is actually running */}
                {isPlaying && (
                  <div className="absolute top-4 left-4 text-white">
                    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 space-y-1">
                      <div className="text-sm">
                        Score:{" "}
                        <span className="text-blue-300 font-bold">
                          {gameState.score}
                        </span>
                      </div>
                      <div className="text-sm">
                        Level:{" "}
                        <span className="text-green-300 font-bold">
                          {gameState.level}
                        </span>
                      </div>
                      <div className="text-sm">
                        Lives:{" "}
                        <span className="text-red-400 font-bold">
                          {gameState.lives}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Game Over Overlay */}
                {gameState.gameOver && (
                  <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-4xl font-bold text-white mb-4">
                        Game Over
                      </h3>
                      <p className="text-xl text-gray-300 mb-6">
                        Final Score: {gameState.score}
                      </p>
                      <button
                        onClick={handleRestart}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                      >
                        Play Again
                      </button>
                    </div>
                  </div>
                )}

                {/* Level Complete Overlay */}
                {gameState.gameWon && (
                  <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-4xl font-bold text-white mb-4">
                        Level Complete!
                      </h3>
                      <p className="text-xl text-gray-300 mb-6">
                        Score: {gameState.score}
                      </p>
                      <button
                        onClick={handleRestart}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                      >
                        Next Level
                      </button>
                    </div>
                  </div>
                )}

                {/* Pause Overlay */}
                {isPaused && isPlaying && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                    <div className="text-center">
                      <Pause className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Game Paused
                      </h3>
                      <button
                        onClick={handlePlayPause}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                      >
                        Resume
                      </button>
                    </div>
                  </div>
                )}

                {/* Start Game Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-6">{game.icon}</div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        {game.title}
                      </h3>
                      <p className="text-lg text-gray-300 mb-8 max-w-md">
                        Ready to start your gaming adventure? Click play to
                        begin!
                      </p>
                      <button
                        onClick={handlePlayPause}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg flex items-center space-x-3 mx-auto group hover:from-blue-600 hover:to-purple-600 transition-all"
                      >
                        <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                        <span>Start Game</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            {/* Game Info */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2 text-blue-400" />
                Game Controls
              </h3>

              <div className="space-y-3">
                {Object.entries(game.controls || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-400 capitalize">{key}:</span>
                    <span className="text-white font-mono text-sm bg-slate-700 px-2 py-1 rounded">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* How to Play */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <h4 className="text-lg font-semibold text-white mb-3">
                  How to Play
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {game.howToPlay?.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Related Games */}
            {relatedGames.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  You Might Also Like
                </h3>
                <div className="space-y-4">
                  {relatedGames.map((relatedGame) => (
                    <div
                      key={relatedGame.id}
                      className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg flex items-center justify-center text-2xl">
                        {relatedGame.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold truncate">
                          {relatedGame.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{relatedGame.rating}</span>
                        </div>
                      </div>
                      <Link
                        to={`/game/${relatedGame.id}`}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                      >
                        Play
                      </Link>
                    </div>
                  ))}
                </div>

                <Link
                  to="/games"
                  className="block text-center text-blue-400 hover:text-blue-300 transition-colors duration-300 mt-4 pt-4 border-t border-slate-600"
                >
                  Browse All Games →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Game Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Game Information
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">About</h4>
                  <p className="text-gray-300 text-sm">{game.description}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Controls</h4>
                  <div className="space-y-1">
                    {Object.entries(game.controls || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{key}:</span>
                        <span className="text-white font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
