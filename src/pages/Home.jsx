// Home page component with hero section and featured games
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Star,
  Users,
  Trophy,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GamepadIcon,
} from "lucide-react";
import GameCard from "../components/GameCard";
import { games } from "../data/games";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({ players: 0, games: 0, hours: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Featured games (first 6 games)
  const featuredGames = games.slice(0, 6);

  // Popular games (games with highest rating)
  const popularGames = games.sort((a, b) => b.rating - a.rating).slice(0, 4);

  // Carousel data
  const carouselSlides = [
    {
      title: "Ultimate Gaming Experience",
      subtitle: "Play Amazing Browser Games",
      description:
        "Discover the best collection of browser games. No downloads, no installations, just pure gaming fun!",
      image: "/api/placeholder/800/400",
      cta: "Explore Games",
      link: "/games",
    },
    {
      title: "Action-Packed Adventures",
      subtitle: "Heart-Racing Gameplay",
      description:
        "Dive into thrilling action games that will keep you on the edge of your seat.",
      image: "/api/placeholder/800/400",
      cta: "Play Action Games",
      link: "/games?category=action",
    },
    {
      title: "Join Gaming Community",
      subtitle: "Connect & Compete",
      description:
        "Join thousands of players worldwide in epic gaming battles and challenges.",
      image: "/api/placeholder/800/400",
      cta: "Join Now",
      link: "/contact",
    },
  ];

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // Animate stats on mount
  useEffect(() => {
    setIsVisible(true);
    const animateStats = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      const targetStats = {
        players: 50000,
        games: games.length,
        hours: 100000,
      };

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setStats({
          players: Math.floor(targetStats.players * progress),
          games: Math.floor(targetStats.games * progress),
          hours: Math.floor(targetStats.hours * progress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setStats(targetStats);
        }
      }, stepDuration);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        observer.disconnect();
      }
    });

    const statsElement = document.getElementById("stats-section");
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background slides */}
        <div className="absolute inset-0">
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/70 to-transparent z-10"></div>
              <div className="w-full h-full bg-gradient-to-br from-primary-900/30 via-accent-900/20 to-dark-950/50 flex items-center justify-center">
                <div className="text-6xl font-bold text-primary-300/20">
                  <GamepadIcon className="w-96 h-96" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1
              className="text-5xl md:text-7xl font-bold gradient-text mb-6 glitch"
              data-text={carouselSlides[currentSlide].title}
            >
              {carouselSlides[currentSlide].title}
            </h1>
            <h2 className="text-2xl md:text-4xl text-primary-300 font-semibold mb-4">
              {carouselSlides[currentSlide].subtitle}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {carouselSlides[currentSlide].description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to={carouselSlides[currentSlide].link}
                className="btn-gaming px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 group"
              >
                <span>{carouselSlides[currentSlide].cta}</span>
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </Link>

              <Link
                to="/blogs"
                className="px-8 py-4 border-2 border-primary-400 text-primary-300 rounded-xl font-semibold hover:bg-primary-400 hover:text-dark-900 transition-all duration-300 flex items-center space-x-3"
              >
                <span>Read Gaming Blogs</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-dark-800/50 hover:bg-dark-700/70 text-white rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-dark-800/50 hover:bg-dark-700/70 text-white rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-primary-400 scale-125"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary-400 rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 bg-dark-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                label: "Active Players",
                value: stats.players,
                suffix: "+",
              },
              {
                icon: GamepadIcon,
                label: "Games Available",
                value: stats.games,
                suffix: "",
              },
              {
                icon: Trophy,
                label: "Hours Played",
                value: stats.hours,
                suffix: "K+",
              },
            ].map(({ icon: Icon, label, value, suffix }) => (
              <div key={label} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {value.toLocaleString()}
                  {suffix}
                </h3>
                <p className="text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-4">
              Featured Games
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover our handpicked selection of the most exciting and popular
              games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/games"
              className="btn-gaming px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center space-x-3 group"
            >
              <span>View All Games</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="py-16 bg-dark-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-4">
              Most Popular
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of players in these trending games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGames.map((game, index) => (
              <div key={game.id} className="relative group">
                <div className="gaming-card bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-primary-500/50">
                  <div className="relative h-48 bg-gradient-to-br from-primary-900/30 to-accent-900/30 flex items-center justify-center">
                    <div className="text-4xl">{game.icon}</div>
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {game.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">
                          {game.rating}
                        </span>
                      </div>
                      <span className="text-xs text-primary-400 bg-primary-500/20 px-2 py-1 rounded">
                        {game.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-4">
              Why Choose Gaming Fusion Hub?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience gaming like never before with our cutting-edge platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Play",
                description:
                  "No downloads or installations required. Jump into any game instantly with just one click.",
                color: "text-yellow-400",
              },
              {
                icon: Trophy,
                title: "High Quality Games",
                description:
                  "Curated collection of premium games with stunning graphics and engaging gameplay.",
                color: "text-primary-400",
              },
              {
                icon: Users,
                title: "Active Community",
                description:
                  "Join a vibrant community of gamers, share experiences, and compete with friends.",
                color: "text-accent-400",
              },
            ].map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="gaming-card bg-dark-800/50 p-8 rounded-xl border border-dark-700 hover:border-primary-500/50 text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${color} bg-current/10 rounded-full mb-6`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <p className="text-gray-300 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-900/30 to-accent-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-6">
            Ready to Start Gaming?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of players already enjoying our amazing collection of
            browser games. Start your gaming journey today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/games"
              className="btn-gaming px-10 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 group"
            >
              <span>Start Playing Now</span>
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </Link>
            <Link
              to="/blogs"
              className="px-10 py-4 border-2 border-accent-400 text-accent-300 rounded-xl font-semibold hover:bg-accent-400 hover:text-dark-900 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
