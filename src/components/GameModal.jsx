// Game Modal component for showing game information
import React, { useEffect } from "react";
import { X, Star, Users, Clock, Gamepad2, Info } from "lucide-react";

const GameModal = ({ game, onClose }) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!game) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl bg-dark-800 rounded-xl border border-primary-500/30 shadow-2xl shadow-primary-500/20 transform animate-pulse-slow">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white rounded-lg transition-all duration-300 z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="relative p-6 border-b border-dark-700 bg-gradient-to-r from-primary-900/20 to-accent-900/20 rounded-t-xl">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center text-4xl border border-primary-500/30">
              {game.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold gradient-text mb-2">
                {game.title}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {game.description}
              </p>

              {/* Game Stats */}
              <div className="flex items-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{game.rating}</span>
                  <span className="text-gray-400">/5</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-primary-400" />
                  <span className="text-gray-300">{game.players} players</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-accent-400" />
                  <span className="text-gray-300">{game.duration}</span>
                </div>
                <span className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-xs font-medium capitalize">
                  {game.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How to Play */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary-400" />
                How to Play
              </h3>
              <div className="space-y-3">
                {game.howToPlay?.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2 text-accent-400" />
                Controls
              </h3>
              <div className="space-y-3">
                {Object.entries(game.controls || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 px-3 bg-dark-700/50 rounded-lg"
                  >
                    <span className="text-gray-300 capitalize text-sm">
                      {key}:
                    </span>
                    <span className="text-white font-mono text-sm bg-dark-600 px-2 py-1 rounded border border-dark-500">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Game Tips */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-white mb-3">
                  💡 Pro Tips
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0 mt-2"></span>
                    <span>
                      Practice makes perfect - don't give up on your first try!
                    </span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-accent-400 rounded-full flex-shrink-0 mt-2"></span>
                    <span>
                      Use fullscreen mode for the best gaming experience.
                    </span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0 mt-2"></span>
                    <span>
                      Check the settings for sound and quality options.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Game Features */}
          <div className="mt-6 pt-6 border-t border-dark-600">
            <h4 className="text-md font-semibold text-white mb-4">
              🎮 Game Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Browser-based gameplay",
                "No downloads required",
                "Responsive controls",
                "High-quality graphics",
                "Cross-platform compatible",
                "Regular updates",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"></div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement System Preview */}
          <div className="mt-6 pt-6 border-t border-dark-600">
            <h4 className="text-md font-semibold text-white mb-4">
              🏆 Achievements
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: "First Victory",
                  desc: "Complete your first level",
                  icon: "🎯",
                },
                {
                  name: "Score Master",
                  desc: "Reach 10,000 points",
                  icon: "⭐",
                },
                {
                  name: "Speed Runner",
                  desc: "Complete game in under 5 minutes",
                  icon: "⚡",
                },
                {
                  name: "Perfectionist",
                  desc: "Complete without losing a life",
                  icon: "💎",
                },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-dark-700/30 rounded-lg border border-dark-600 hover:border-primary-500/30 transition-all duration-300"
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h5 className="text-white text-sm font-semibold">
                      {achievement.name}
                    </h5>
                    <p className="text-gray-400 text-xs">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-700 bg-dark-700/30 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Ready to play? Click "Start Game" to begin your adventure!
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-gray-300 hover:text-white rounded-lg transition-all duration-300 font-medium"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="btn-gaming px-6 py-2 rounded-lg font-semibold flex items-center space-x-2"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Let's Play!</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-t-xl"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
};

export default GameModal;
