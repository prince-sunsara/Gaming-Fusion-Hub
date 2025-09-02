// Blogs page with featured articles and categories
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  ArrowRight,
  Filter,
  X,
  ChevronDown,
  Bookmark,
  Share2,
  TrendingUp,
} from "lucide-react";
import {
  blogs,
  blogCategories,
  getBlogsByCategory,
  searchBlogs,
  getPopularBlogs,
  getRecentBlogs,
} from "../data/blogs";

const BlogsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // 'recent', 'popular', 'title'
  const [isLoading, setIsLoading] = useState(false);

  // Featured blog (most recent)
  const featuredBlog = getRecentBlogs(1)[0];
  // Popular blogs for sidebar
  const popularBlogs = getPopularBlogs(4);
  // Recent blogs for sidebar
  const recentBlogs = getRecentBlogs(5);

  // Update filtered blogs when search/filters change
  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      let result = blogs;

      // Apply category filter
      if (selectedCategory !== "all") {
        result = getBlogsByCategory(selectedCategory);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        result = result.filter(
          (blog) =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
      }

      // Apply sorting
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "popular":
            return b.views - a.views;
          case "title":
            return a.title.localeCompare(b.title);
          case "recent":
          default:
            return new Date(b.publishDate) - new Date(a.publishDate);
        }
      });

      setFilteredBlogs(result);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);

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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("recent");
  };

  const currentCategory = blogCategories.find(
    (cat) => cat.id === selectedCategory
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-6xl font-bold gradient-text mb-4 glitch"
            data-text="Gaming Blogs"
          >
            Gaming Blogs
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the latest gaming insights, reviews, and tutorials from our
            community of gaming enthusiasts.
          </p>
        </div>

        {/* Featured Article */}
        {featuredBlog && (
          <div className="gaming-card bg-gradient-to-r from-primary-900/20 to-accent-900/20 rounded-xl border border-primary-500/30 overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Featured
                  </span>
                </div>
                <div className="text-6xl">
                  {featuredBlog.category === "technology"
                    ? "⚡"
                    : featuredBlog.category === "reviews"
                    ? "⭐"
                    : "📝"}
                </div>
              </div>

              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <span className="bg-primary-500/20 text-primary-300 px-2 py-1 rounded capitalize">
                    {featuredBlog.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(featuredBlog.publishDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredBlog.readTime}</span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 hover:text-primary-300 transition-colors duration-300">
                  <Link to={`/blog/${featuredBlog.slug}`}>
                    {featuredBlog.title}
                  </Link>
                </h2>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {featuredBlog.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{featuredBlog.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{featuredBlog.views.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link
                    to={`/blog/${featuredBlog.slug}`}
                    className="btn-gaming px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 group"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search and Filter Bar */}
            <div className="bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
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

                {/* Filter and Sort Controls */}
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
                        {blogCategories.map((category) => (
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
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-all duration-300"
                  >
                    <option value="recent">Recent</option>
                    <option value="popular">Popular</option>
                    <option value="title">Title</option>
                  </select>
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
                    <span>Loading articles...</span>
                  </div>
                ) : (
                  <span>
                    Showing {filteredBlogs.length} of {blogs.length} articles
                    {selectedCategory !== "all" &&
                      ` in ${currentCategory?.name}`}
                  </span>
                )}
              </div>
            </div>

            {/* Blog Articles */}
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="gaming-card bg-dark-800 rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-6 bg-dark-700 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-dark-700 rounded mb-2"></div>
                    <div className="h-4 bg-dark-700 rounded mb-4 w-5/6"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-dark-700 rounded w-32"></div>
                      <div className="h-4 bg-dark-700 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBlogs.length > 0 ? (
              <div className="space-y-6">
                {filteredBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 hover:border-primary-500/50 overflow-hidden transition-all duration-300"
                  >
                    <div className="p-6">
                      {/* Article Header */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                        <span className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full capitalize font-medium">
                          {blog.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(blog.publishDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{blog.readTime}</span>
                        </div>
                      </div>

                      {/* Article Title */}
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 hover:text-primary-300 transition-colors duration-300 line-clamp-2">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h2>

                      {/* Article Excerpt */}
                      <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {blog.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-dark-600 text-gray-400 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Article Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{blog.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{blog.likes}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-accent-400 transition-colors duration-300">
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-primary-400 transition-colors duration-300">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="btn-gaming px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 text-sm group"
                          >
                            <span>Read More</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              // No results
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  No articles found
                </h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? `No articles match your search "${searchQuery}"`
                    : `No articles found in ${currentCategory?.name} category`}
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-gaming px-6 py-3 rounded-lg font-semibold"
                >
                  <span>Show All Articles</span>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Popular Articles */}
              <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-accent-400" />
                  Popular Articles
                </h3>

                <div className="space-y-4">
                  {popularBlogs.map((blog, index) => (
                    <div
                      key={blog.id}
                      className="flex items-start space-x-3 p-3 bg-dark-700/50 rounded-lg hover:bg-dark-600/50 transition-all duration-300"
                    >
                      <span className="w-6 h-6 bg-gradient-to-r from-accent-500 to-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="text-white font-medium hover:text-primary-300 transition-colors duration-300 line-clamp-2 text-sm"
                        >
                          {blog.title}
                        </Link>
                        <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                          <Eye className="w-3 h-3" />
                          <span>{blog.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Articles */}
              <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-400" />
                  Recent Articles
                </h3>

                <div className="space-y-4">
                  {recentBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="border-l-2 border-primary-500 pl-4 hover:border-accent-500 transition-colors duration-300"
                    >
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="text-white font-medium hover:text-primary-300 transition-colors duration-300 line-clamp-2 text-sm"
                      >
                        {blog.title}
                      </Link>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDate(blog.publishDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Categories
                </h3>

                <div className="space-y-2">
                  {blogCategories
                    .filter((cat) => cat.id !== "all")
                    .map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300 ${
                          selectedCategory === category.id
                            ? "bg-primary-500/20 text-primary-300"
                            : "text-gray-300 hover:bg-dark-600/50 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span>{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="text-xs bg-dark-600 px-2 py-1 rounded">
                          {getBlogsByCategory(category.id).length}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default BlogsPage;
