// Main App component for Gaming Fusion Hub
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { cssVariables } from "./config/theme";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

// Pages
import Home from "./pages/Home";
import GameLibrary from "./pages/GameLibrary";
import GamePage from "./pages/GamePage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetails from "./pages/BlogDetails";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// SEO component for dynamic meta tags
import SEOHead from "./components/SEOHead";

function App() {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Apply CSS custom properties to document root
    const root = document.documentElement;
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App min-h-screen bg-dark-950 text-gray-100">
        {/* SEO Head component */}
        <SEOHead />

        {/* Background effects */}
        <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>
        <div className="fixed inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/20 pointer-events-none"></div>

        {/* Main app structure */}
        <div className="relative z-10">
          <Navbar />

          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<GameLibrary />} />
              <Route path="/game/:gameId" element={<GamePage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blog/:blogId" element={<BlogDetails />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold gradient-text mb-4">
                        404
                      </h1>
                      <p className="text-xl text-gray-400 mb-8">
                        Page Not Found
                      </p>
                      <a
                        href="/"
                        className="btn-gaming px-8 py-3 rounded-lg font-semibold"
                      >
                        <span>Return Home</span>
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
