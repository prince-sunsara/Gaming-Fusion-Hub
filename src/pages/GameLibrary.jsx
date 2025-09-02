// Game Library page with search, filter, and layout options
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Grid,
  List,
  Filter,
  X,
  ChevronDown,
  SortAsc,
  SortDesc,
  Star,
  Users,
  Clock,
} from "lucide-react";
import GameCard from "../components/GameCard";
import {
  games,
  gameCategories,
  getGamesByCategory,
  searchGames,
} from "../data/games";

const GameLibrary = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [layout, setLayout] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("title"); // 'title', 'rating', 'players'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [showFilters, setShowFilters] = useState(false);
  const [filteredGames, setFilteredGames] = useState(games);
  const [isLoading, setIsLoading] = useState(false);

  // Update filtered games when search/filters change
  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      let result = games;

      // Apply category filter
      if (selectedCategory !== "all") {
        result = getGamesByCategory(selectedCategory);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        result = result.filter(
          (game) =>
            game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            game.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply sorting
      result = [...result].sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case "rating":
            aValue = a.rating;
            bValue = b.rating;
            break;
          case "players":
            aValue = parseFloat(a.players.replace(/[^\d.]/g, ""));
            bValue = parseFloat(b.players.replace(/[^\d.]/g, ""));
            break;
          case "title":
          default:
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
        }

        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      setFilteredGames(result);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy, sortOrder]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowFilters(false);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("title");
    setSortOrder("asc");
  };

  const currentCategory = gameCategories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-6xl font-bold gradient-text mb-4 glitch"
            data-text="Game Library"
          >
            Game Library
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover amazing browser games across different genres. No downloads
            required!
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter and Layout Controls */}
            <div className="flex items-center gap-3">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-primary-500/50 rounded-lg text-white transition-all duration-300"
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {currentCategory?.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-20 overflow-hidden">
                    {gameCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-dark-700 transition-colors duration-300 ${
                          selectedCategory === category.id
                            ? "bg-primary-500/20 text-primary-300"
                            : "text-gray-300"
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2 bg-dark-700 rounded-lg p-1">
                {[
                  { key: "title", icon: SortAsc, label: "Name" },
                  { key: "rating", icon: Star, label: "Rating" },
                  { key: "players", icon: Users, label: "Players" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => handleSortChange(key)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-300 ${
                      sortBy === key
                        ? "bg-primary-500 text-white"
                        : "text-gray-400 hover:text-white hover:bg-dark-600"
                    }`}
                    title={`Sort by ${label}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">{label}</span>
                    {sortBy === key && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${
                          sortOrder === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Layout Toggle */}
              <div className="flex items-center bg-dark-700 rounded-lg p-1">
                <button
                  onClick={() => setLayout("grid")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    layout === "grid"
                      ? "bg-primary-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    layout === "list"
                      ? "bg-primary-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-600">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Active filters:</span>
                {searchQuery && (
                  <span className="bg-primary-500/20 text-primary-300 px-2 py-1 rounded">
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span className="bg-accent-500/20 text-accent-300 px-2 py-1 rounded">
                    {currentCategory?.name}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Clear all</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-400">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Searching games...</span>
              </div>
            ) : (
              <span>
                Showing {filteredGames.length} of {games.length} games
                {selectedCategory !== "all" && ` in ${currentCategory?.name}`}
              </span>
            )}
          </div>

          <div className="text-sm text-gray-400">
            Sorted by {sortBy} (
            {sortOrder === "asc" ? "ascending" : "descending"})
          </div>
        </div>

        {/* Games Grid/List */}
        {isLoading ? (
          // Loading skeleton
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-4"
            }
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="gaming-card bg-dark-800 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-dark-700"></div>
                <div className="p-5">
                  <div className="h-6 bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-dark-700 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-dark-700 rounded w-20"></div>
                    <div className="h-4 bg-dark-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-4"
            }
          >
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} layout={layout} />
            ))}
          </div>
        ) : (
          // No results
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No games found
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery
                ? `No games match your search "${searchQuery}"`
                : `No games found in ${currentCategory?.name} category`}
            </p>
            <button
              onClick={clearFilters}
              className="btn-gaming px-6 py-3 rounded-lg font-semibold"
            >
              <span>Show All Games</span>
            </button>
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredGames.length > 0 && filteredGames.length >= 12 && (
          <div className="text-center mt-12">
            <button className="btn-gaming px-8 py-3 rounded-lg font-semibold">
              <span>Load More Games</span>
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close filters */}
      {showFilters && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowFilters(false)}
        ></div>
      )}
    </div>
  );
};

export default GameLibrary;
