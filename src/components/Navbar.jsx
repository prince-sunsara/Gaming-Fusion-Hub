// Navbar component with gaming aesthetics and responsive design
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Gamepad2,
  Home,
  Library,
  BookOpen,
  Info,
  Mail,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Navigation items with icons
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/games", label: "Games", icon: Library },
    { path: "/blogs", label: "Blogs", icon: BookOpen },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-dark-900/95 backdrop-blur-md shadow-lg shadow-primary-500/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 md:w-10 md:h-10 text-primary-400 group-hover:text-accent-400 transition-colors duration-300" />
                <div className="absolute inset-0 bg-primary-400 group-hover:bg-accent-400 rounded-full blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
                  Gaming Fusion Hub
                </h1>
                <p className="text-xs text-gray-400 -mt-1">
                  Ultimate Gaming Experience
                </p>
              </div>
              {/* Mobile logo text */}
              <div className="sm:hidden">
                <h1 className="text-lg font-bold gradient-text">GFH</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                    isActive(path)
                      ? "text-primary-300 bg-primary-500/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>

                  {/* Active indicator */}
                  {isActive(path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"></div>
                  )}

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isOpen
              ? "max-h-96 bg-dark-900/98 backdrop-blur-md border-t border-primary-500/20"
              : "max-h-0"
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive(path)
                      ? "text-primary-300 bg-primary-500/20 shadow-lg shadow-primary-500/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                  {isActive(path) && (
                    <div className="ml-auto w-2 h-2 bg-primary-400 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Navbar spacer to prevent content overlap */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
