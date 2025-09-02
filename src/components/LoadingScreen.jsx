// Loading Screen component with gaming aesthetics
import React, { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Gaming Hub");

  const loadingMessages = [
    "Initializing Gaming Hub",
    "Loading Game Assets",
    "Connecting to Servers",
    "Preparing Experience",
    "Almost Ready",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;

        // Update loading text based on progress
        if (newProgress < 20) {
          setLoadingText(loadingMessages[0]);
        } else if (newProgress < 40) {
          setLoadingText(loadingMessages[1]);
        } else if (newProgress < 60) {
          setLoadingText(loadingMessages[2]);
        } else if (newProgress < 80) {
          setLoadingText(loadingMessages[3]);
        } else {
          setLoadingText(loadingMessages[4]);
        }

        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-dark-950 z-50 flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 cyber-grid opacity-20 animate-pulse"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-neon-green rounded-full animate-ping animation-delay-300"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-accent-400 rounded-full animate-ping animation-delay-500"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-primary-400 rounded-full animate-ping animation-delay-700"></div>
      </div>

      {/* Main loading content */}
      <div className="text-center z-10 max-w-md mx-auto px-4">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-6xl font-bold gradient-text glitch mb-4"
            data-text="GFH"
          >
            GFH
          </h1>
          <p className="text-xl md:text-2xl text-primary-300 font-semibold tracking-wider">
            Gaming Fusion Hub
          </p>
        </div>

        {/* Loading animation */}
        <div className="mb-8">
          <div className="relative w-64 h-64 mx-auto">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-primary-500/30 rounded-full animate-spin"></div>

            {/* Middle rotating ring */}
            <div
              className="absolute inset-4 border-4 border-accent-500/50 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-pulse flex items-center justify-center">
              <div className="text-white font-bold text-2xl">
                {Math.round(progress)}%
              </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full bg-neon-cyan animate-ping`}
                  style={{
                    top: `${20 + (i * 60) / 6}%`,
                    left: `${10 + (i * 80) / 6}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>0%</span>
            <span className="text-primary-400 font-semibold">
              {Math.round(progress)}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading text */}
        <div className="mb-4">
          <p className="text-lg text-primary-300 font-medium animate-pulse">
            {loadingText}
          </p>
        </div>

        {/* Loading dots animation */}
        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-accent-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* Gaming tip */}
        <div className="mt-8 text-sm text-gray-500">
          <p>💡 Tip: Use WASD keys for movement in most games</p>
        </div>
      </div>

      {/* Glowing effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
