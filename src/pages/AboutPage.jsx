// About page component
import { Link } from "react-router-dom";
import {
  Gamepad2,
  Target,
  Users,
  Globe,
  Zap,
  Heart,
  Award,
  Rocket,
  Code,
  Shield,
  Star,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    {
      icon: Users,
      label: "Active Players",
      value: "50,000+",
      color: "text-primary-400",
    },
    {
      icon: Gamepad2,
      label: "Games Available",
      value: "10+",
      color: "text-accent-400",
    },
    {
      icon: Globe,
      label: "Countries Served",
      value: "120+",
      color: "text-green-400",
    },
    { icon: Award, label: "Awards Won", value: "5", color: "text-yellow-400" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Instant Play",
      description:
        "Jump into any game immediately without downloads, installations, or lengthy setup processes.",
      color: "text-yellow-400",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "All games are tested and verified to ensure a safe, malware-free gaming experience.",
      color: "text-green-400",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Built by gamers for gamers, with community feedback driving our development roadmap.",
      color: "text-blue-400",
    },
    {
      icon: Globe,
      title: "Global Access",
      description:
        "Available worldwide with multi-language support and optimized for all regions.",
      color: "text-purple-400",
    },
  ];

  const team = [
    {
      name: "Mitesh Amin",
      role: "Founder & CEO",
      description: "Full-stack developer specializing in web technologies",
      avatar: "👩‍💻",
    },
    {
      name: "Prince Sunsara",
      role: "Lead Developer",
      description: "Visionary leader in all our web development tasks",
      avatar: "🎮",
    },
    {
      name: "Abhay Raval",
      role: "Community Member",
      description: "Creative mind behind our most popular game mechanics",
      avatar: "🎨",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Gaming",
      description:
        "We live and breathe games, understanding what makes experiences truly engaging and fun.",
    },
    {
      icon: Code,
      title: "Innovation First",
      description:
        "Constantly pushing boundaries with cutting-edge web technologies and creative gameplay.",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "Our players are at the heart of everything we do, from game selection to platform features.",
    },
    {
      icon: Target,
      title: "Quality Commitment",
      description:
        "Every game is carefully curated and tested to meet our high standards for entertainment.",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1
            className="text-4xl md:text-6xl font-bold gradient-text mb-6 glitch"
            data-text="About Gaming Fusion Hub"
          >
            About Gaming Fusion Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're passionate gamers on a mission to make high-quality browser
            games accessible to everyone, everywhere. No downloads, no
            barriers—just pure gaming joy.
          </p>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6 text-center group hover:border-primary-500/50"
              >
                <Icon
                  className={`w-12 h-12 ${color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {value}
                </h3>
                <p className="text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-16">
          <div className="gaming-card bg-gradient-to-r from-primary-900/20 to-accent-900/20 rounded-xl border border-primary-500/30 p-8 md:p-12 text-center">
            <Rocket className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To democratize gaming by creating a platform where anyone with a
              web browser can access premium gaming experiences instantly. We
              believe great games should be universally accessible, bringing joy
              and connection to players worldwide.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We're not just another gaming platform—we're your gateway to the
              future of browser gaming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-8 group hover:border-primary-500/50"
              >
                <Icon
                  className={`w-12 h-12 ${color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                />
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <p className="text-gray-300 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Gaming Fusion Hub was born from a simple frustration: why
                  should great games be locked behind app stores, lengthy
                  downloads, and device limitations? Our founders, all
                  passionate gamers themselves, envisioned a world where the joy
                  of gaming could be shared instantly.
                </p>
                <p>
                  Starting in 2025, we set out to curate and create the finest
                  collection of browser-based games. Every title on our platform
                  is carefully selected for its entertainment value, technical
                  excellence, and accessibility across all devices and browsers.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 active players across
                  120+ countries, making Gaming Fusion Hub a truly global gaming
                  community. But we're just getting started—the future of
                  browser gaming is incredibly bright.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="gaming-card bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl p-12 text-center border border-primary-500/30">
                <div className="text-8xl mb-6">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Launched 2025
                </h3>
                <p className="text-gray-300">
                  From concept to global platform in record time, powered by
                  passion and innovation.
                </p>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at Gaming Fusion Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start space-x-6 p-6 bg-dark-800/30 rounded-xl border border-dark-700 hover:border-primary-500/30 transition-all duration-300"
              >
                <Icon className="w-10 h-10 text-primary-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-gray-300 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The passionate individuals behind Gaming Fusion Hub's success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map(({ name, role, description, avatar }) => (
              <div
                key={name}
                className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6 text-center group hover:border-primary-500/50"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {avatar}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
                <p className="text-primary-400 font-semibold mb-3">{role}</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Built with Modern Tech
              </h2>
              <p className="text-xl text-gray-300">
                Leveraging cutting-edge web technologies for the best gaming
                experience.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                {
                  name: "HTML5 Canvas",
                  icon: "🎨",
                  desc: "Advanced 2D graphics",
                },
                { name: "WebGL", icon: "🔥", desc: "Hardware acceleration" },
                {
                  name: "JavaScript ES6+",
                  icon: "⚡",
                  desc: "Modern programming",
                },
                {
                  name: "Progressive Web Apps",
                  icon: "📱",
                  desc: "App-like experience",
                },
                { name: "WebAssembly", icon: "🚀", desc: "Native performance" },
                { name: "WebRTC", icon: "🌐", desc: "Real-time multiplayer" },
                {
                  name: "Service Workers",
                  icon: "⚙️",
                  desc: "Offline capabilities",
                },
                { name: "Web Audio API", icon: "🔊", desc: "Immersive sound" },
              ].map(({ name, icon, desc }) => (
                <div
                  key={name}
                  className="p-4 bg-dark-700/50 rounded-lg hover:bg-dark-600/50 transition-all duration-300"
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <h4 className="text-white font-semibold mb-1">{name}</h4>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Recognition from the gaming community and industry experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                award: "Best Browser Gaming Platform",
                year: "2024",
                organization: "Web Gaming Awards",
                icon: "🏆",
              },
              {
                award: "Innovation in Web Technology",
                year: "2024",
                organization: "Tech Innovation Summit",
                icon: "💡",
              },
              {
                award: "Community Choice Award",
                year: "2024",
                organization: "Gamers United",
                icon: "⭐",
              },
            ].map(({ award, year, organization, icon }) => (
              <div
                key={award}
                className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-6 text-center group hover:border-accent-500/50"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{award}</h3>
                <p className="text-accent-400 font-semibold mb-1">{year}</p>
                <p className="text-gray-400 text-sm">{organization}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Future Vision */}
        <section className="mb-16">
          <div className="gaming-card bg-gradient-to-r from-accent-900/20 to-primary-900/20 rounded-xl border border-accent-500/30 p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                The Future of Gaming
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We're just getting started. Here's what we're working on to
                revolutionize browser gaming.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "AI-Powered Games",
                  description:
                    "Intelligent NPCs and procedurally generated content",
                  icon: "🤖",
                  status: "In Development",
                },
                {
                  title: "VR/AR Integration",
                  description: "Immersive experiences through WebXR technology",
                  icon: "🥽",
                  status: "Research Phase",
                },
                {
                  title: "Blockchain Gaming",
                  description: "NFT integration and play-to-earn mechanics",
                  icon: "⛓️",
                  status: "Planning",
                },
                {
                  title: "Cloud Gaming",
                  description: "Stream AAA games directly in your browser",
                  icon: "☁️",
                  status: "Beta Testing",
                },
                {
                  title: "Social Gaming Hub",
                  description:
                    "Voice chat, tournaments, and community features",
                  icon: "👥",
                  status: "Coming Soon",
                },
                {
                  title: "Mobile Optimization",
                  description: "Enhanced touch controls and mobile UI",
                  icon: "📱",
                  status: "In Progress",
                },
              ].map(({ title, description, icon, status }) => (
                <div
                  key={title}
                  className="p-6 bg-dark-800/30 rounded-lg border border-dark-600"
                >
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{description}</p>
                  <span className="inline-block bg-accent-500/20 text-accent-300 px-2 py-1 rounded text-xs font-medium">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <div className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Join Our Gaming Revolution
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you're a player, developer, or gaming enthusiast, we'd
              love to hear from you. Let's shape the future of browser gaming
              together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/games"
                className="btn-gaming px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 group"
              >
                <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Start Playing Now</span>
              </Link>

              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-accent-400 text-accent-300 rounded-xl font-semibold hover:bg-accent-400 hover:text-dark-900 transition-all duration-300 flex items-center space-x-3"
              >
                <Heart className="w-5 h-5" />
                <span>Get in Touch</span>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 pt-8 border-t border-dark-600">
              <p className="text-gray-400 mb-4">Trusted by gamers worldwide</p>
              <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
                <span className="ml-3 text-white font-semibold">4.9/5</span>
                <span className="text-gray-400 ml-2">(2,847 reviews)</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
