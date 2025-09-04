// Footer component with gaming theme and social links
import React from "react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Github,
  Component,
  Heart,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/games", label: "Game Library" },
    { path: "/blogs", label: "Gaming Blogs" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  const gameCategories = [
    { path: "/games?category=action", label: "Action Games" },
    { path: "/games?category=racing", label: "Racing Games" },
    { path: "/games?category=puzzle", label: "Puzzle Games" },
    { path: "/games?category=shooting", label: "Shooting Games" },
    { path: "/games?category=horror", label: "Horror Games" },
  ];

  const socialLinks = [
    {
      icon: Twitter,
      label: "X",
      url: "https://x.com",
      color: "hover:text-blue-400",
    },
    {
      icon: Facebook,
      label: "Facebook",
      url: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: "https://instagram.com",
      color: "hover:text-pink-400",
    },
    {
      icon: Youtube,
      label: "YouTube",
      url: "https://youtube.com",
      color: "hover:text-red-500",
    },
    {
      icon: Component,
      label: "Discord",
      url: "https://discord.com",
      color: "hover:text-indigo-400",
    },
    {
      icon: Github,
      label: "GitHub",
      url: "https://github.com",
      color: "hover:text-gray-400",
    },
  ];

  return (
    <footer className="bg-dark-950 border-t border-primary-500/20 mt-auto">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <Gamepad2 className="w-10 h-10 text-primary-400" />
                <div className="absolute inset-0 bg-primary-400 rounded-full blur opacity-50"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">
                  Gaming Fusion Hub
                </h3>
                <p className="text-sm text-gray-400">
                  Ultimate Gaming Experience
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your premier destination for browser-based gaming. Discover, play,
              and enjoy amazing games without downloads or installations.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, label, url, color }) => (
                <a
                  key={label}
                  href={url}
                  className={`p-2 bg-dark-800 rounded-lg text-gray-400 ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-current/25`}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-primary-400 to-accent-400 rounded-full mr-3"></div>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-primary-300 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Game Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-accent-400 to-primary-400 rounded-full mr-3"></div>
              Game Categories
            </h4>
            <ul className="space-y-3">
              {gameCategories.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-accent-300 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-2 h-2 bg-accent-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-primary-400 to-accent-400 rounded-full mr-3"></div>
              Get in Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-primary-400" />
                <a
                  href="mailto:info@gamingfusionhub.com"
                  className="hover:text-primary-300 transition-colors duration-300"
                >
                  info@gamingfusionhub.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-accent-400" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-accent-300 transition-colors duration-300"
                >
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>Gaming Street, Web City</span>
              </div>
            </div>

            {/* Newsletter signup placeholder */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">
                Stay updated with new games!
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-dark-800 border border-dark-600 rounded-l-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors duration-300"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-r-lg hover:from-primary-400 hover:to-accent-400 transition-all duration-300">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>
                © {currentYear} Gaming Fusion Hub. All rights reserved.
              </span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            </div>

            {/* Legal links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-primary-300 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-condition"
                className="text-gray-400 hover:text-primary-300 transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookie-policy"
                className="text-gray-400 hover:text-primary-300 transition-colors duration-300"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Gaming quote */}
          <div className="text-center mt-4 pt-4 border-t border-dark-800">
            <p className="text-xs text-gray-500 italic">
              "Gaming is not a crime, it's an art form that connects people
              worldwide."
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
    </footer>
  );
};

export default Footer;
