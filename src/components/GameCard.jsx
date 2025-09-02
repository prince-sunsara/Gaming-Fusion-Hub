// GameCard component for displaying individual games
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Star,
  Clock,
  Users,
  Info,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";

const GameCard = ({ game, layout = "grid" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: game.description,
        url: window.location.origin + `/game/${game.id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        window.location.origin + `/game/${game.id}`
      );
      // You could show a toast notification here
    }
  };

  // Grid layout (default)
  if (layout === "grid") {
    return (
      <div
        className="gaming-card bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-primary-500/50 transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Game thumbnail/icon */}
        <div className="relative h-48 bg-gradient-to-br from-primary-900/30 to-accent-900/30 flex items-center justify-center overflow-hidden">
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {game.icon}
          </div>

          {/* Overlay with action buttons */}
          <div
            className={`absolute inset-0 bg-dark-950/80 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              to={`/game/${game.id}`}
              className="btn-gaming px-6 py-3 rounded-lg font-bold flex items-center space-x-2 group/btn"
            >
              <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
              <span>Play Now</span>
            </Link>
          </div>

          {/* Top action buttons */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full bg-dark-800/80 hover:bg-dark-700 transition-all duration-300 ${
                isFavorited
                  ? "text-red-400"
                  : "text-gray-400 hover:text-red-400"
              }`}
              aria-label="Add to favorites"
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full bg-dark-800/80 hover:bg-dark-700 transition-all duration-300 ${
                isBookmarked
                  ? "text-yellow-400"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
              aria-label="Bookmark game"
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {game.category}
            </span>
          </div>
        </div>

        {/* Game info */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">
            {game.title}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {game.description}
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{game.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{game.players}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{game.duration}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <Link
              to={`/game/${game.id}`}
              className="flex-1 btn-gaming py-2 px-4 rounded-lg font-semibold text-center mr-2 hover:shadow-lg hover:shadow-primary-500/25"
            >
              <span>Play Game</span>
            </Link>
            <div className="flex space-x-2">
              <Link
                to={`/game/${game.id}`}
                className="p-2 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                aria-label="Game info"
              >
                <Info className="w-4 h-4" />
              </Link>
              <button
                onClick={handleShare}
                className="p-2 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                aria-label="Share game"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List layout
  return (
    <div
      className="gaming-card bg-dark-800 rounded-lg overflow-hidden border border-dark-700 hover:border-primary-500/50 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center p-4">
        {/* Game icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary-900/30 to-accent-900/30 rounded-lg flex items-center justify-center text-2xl mr-4 group-hover:scale-105 transition-transform duration-300">
          {game.icon}
        </div>

        {/* Game info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-300 transition-colors duration-300">
            {game.title}
          </h3>
          <p className="text-gray-400 text-sm mb-2 line-clamp-1">
            {game.description}
          </p>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{game.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{game.players}</span>
            </div>
            <span className="bg-primary-500/20 text-primary-300 px-2 py-1 rounded">
              {game.category}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isFavorited
                ? "text-red-400 bg-red-500/20"
                : "text-gray-400 hover:text-red-400 hover:bg-red-500/20"
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
          </button>

          <Link
            to={`/game/${game.id}`}
            className="btn-gaming px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 group/btn"
          >
            <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
            <span>Play</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
