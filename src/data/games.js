// Games data for Gaming Fusion Hub
export const games = [
  {
    id: 1,
    title: "Neon Racing",
    description:
      "High-speed futuristic racing through neon-lit cyber cities. Dodge obstacles and compete for the fastest time.",
    icon: "🏎️",
    category: "racing",
    rating: 4.8,
    players: "2.5K+",
    duration: "5-15 min",
    howToPlay: [
      "Use WASD or arrow keys to control your vehicle",
      "Avoid obstacles and other racers",
      "Collect power-ups for speed boosts",
      "Complete laps in the fastest time possible",
    ],
    controls: {
      movement: "WASD / Arrow Keys",
      boost: "Spacebar",
      brake: "S / Down Arrow",
    },
    gameType: "canvas",
  },
  {
    id: 2,
    title: "Space Defender",
    description:
      "Defend Earth from alien invasion in this intense space shooter. Upgrade your weapons and survive waves of enemies.",
    icon: "🚀",
    category: "shooting",
    rating: 4.7,
    players: "3.2K+",
    duration: "10-20 min",
    howToPlay: [
      "Move your spaceship with mouse or WASD keys",
      "Left-click or spacebar to shoot",
      "Destroy enemies and collect power-ups",
      "Survive as long as possible against increasing difficulty",
    ],
    controls: {
      movement: "Mouse / WASD",
      shoot: "Left Click / Spacebar",
      special: "Right Click",
    },
    gameType: "canvas",
  },
  {
    id: 3,
    title: "Puzzle Master",
    description:
      "Challenge your mind with complex puzzles and brain teasers. Multiple difficulty levels available.",
    icon: "🧩",
    category: "puzzle",
    rating: 4.6,
    players: "1.8K+",
    duration: "3-10 min",
    howToPlay: [
      "Click and drag pieces to solve puzzles",
      "Use logic to find the correct solution",
      "Complete levels to unlock new challenges",
      "Hint system available if you get stuck",
    ],
    controls: {
      interaction: "Mouse Click & Drag",
      hint: "H Key",
      reset: "R Key",
    },
    gameType: "canvas",
  },
  {
    id: 4,
    title: "Shadow Adventure",
    description:
      "Navigate through dark dungeons filled with monsters and treasures. A thrilling action-adventure experience.",
    icon: "⚔️",
    category: "action",
    rating: 4.9,
    players: "4.1K+",
    duration: "15-30 min",
    howToPlay: [
      "Use WASD to move your character",
      "Left-click to attack enemies",
      "Collect treasures and avoid traps",
      "Find the exit key to complete each level",
    ],
    controls: {
      movement: "WASD Keys",
      attack: "Left Click",
      interact: "E Key",
      inventory: "Tab Key",
    },
    gameType: "canvas",
  },
  {
    id: 5,
    title: "Haunted Manor",
    description:
      "Explore a spooky mansion filled with ghosts and mysteries. Solve puzzles to escape the haunted house.",
    icon: "👻",
    category: "horror",
    rating: 4.5,
    players: "2.7K+",
    duration: "20-45 min",
    howToPlay: [
      "Click to move and interact with objects",
      "Solve puzzles to unlock new areas",
      "Avoid ghosts and supernatural entities",
      "Find clues to uncover the mansion's dark secrets",
    ],
    controls: {
      movement: "Mouse Click",
      interaction: "Left Click",
      inventory: "I Key",
      flashlight: "F Key",
    },
    gameType: "canvas",
  },
  {
    id: 6,
    title: "Cyber Runner",
    description:
      "Endless running through a cyberpunk world. Jump, slide, and dash through obstacles in this fast-paced runner.",
    icon: "🏃",
    category: "action",
    rating: 4.4,
    players: "5.6K+",
    duration: "Endless",
    howToPlay: [
      "Use spacebar or up arrow to jump",
      "Down arrow to slide under obstacles",
      "Collect coins and power-ups",
      "Run as far as possible to achieve high scores",
    ],
    controls: {
      jump: "Spacebar / Up Arrow",
      slide: "Down Arrow",
      dash: "Shift Key",
    },
    gameType: "canvas",
  },
  {
    id: 7,
    title: "Tank Battle",
    description:
      "Command your tank in epic battles. Destroy enemy tanks and defend your base in this strategic warfare game.",
    icon: "🚗",
    category: "shooting",
    rating: 4.6,
    players: "3.9K+",
    duration: "10-25 min",
    howToPlay: [
      "Use WASD to move your tank",
      "Mouse to aim and left-click to shoot",
      "Destroy all enemy tanks to win",
      "Protect your base from enemy attacks",
    ],
    controls: {
      movement: "WASD Keys",
      aim: "Mouse",
      shoot: "Left Click",
      special: "Spacebar",
    },
    gameType: "canvas",
  },
  {
    id: 8,
    title: "Speed Circuit",
    description:
      "Professional racing simulator with realistic physics. Master different tracks and weather conditions.",
    icon: "🏁",
    category: "racing",
    rating: 4.8,
    players: "2.1K+",
    duration: "5-20 min",
    howToPlay: [
      "Arrow keys or WASD to control your race car",
      "Navigate through challenging race tracks",
      "Use racing lines for optimal speed",
      "Complete races to unlock new tracks",
    ],
    controls: {
      accelerate: "W / Up Arrow",
      brake: "S / Down Arrow",
      steer: "A,D / Left,Right Arrows",
      handbrake: "Spacebar",
    },
    gameType: "canvas",
  },
  {
    id: 9,
    title: "Block Breaker",
    description:
      "Classic arcade action with modern twists. Break blocks, collect power-ups, and achieve high scores.",
    icon: "🧱",
    category: "puzzle",
    rating: 4.3,
    players: "1.5K+",
    duration: "5-15 min",
    howToPlay: [
      "Move the paddle with mouse or arrow keys",
      "Bounce the ball to break blocks",
      "Collect falling power-ups for special abilities",
      "Clear all blocks to complete the level",
    ],
    controls: {
      paddle: "Mouse / Arrow Keys",
      launch: "Spacebar",
      pause: "P Key",
    },
    gameType: "canvas",
  },
  {
    id: 10,
    title: "Zombie Survival",
    description:
      "Survive waves of zombies in this intense horror shooter. Manage resources and find safe zones.",
    icon: "🧟",
    category: "horror",
    rating: 4.7,
    players: "6.3K+",
    duration: "15-40 min",
    howToPlay: [
      "WASD to move your character",
      "Mouse to aim and shoot zombies",
      "Find weapons and ammunition",
      "Barricade doors and find safe houses",
    ],
    controls: {
      movement: "WASD Keys",
      aim: "Mouse",
      shoot: "Left Click",
      reload: "R Key",
      interact: "E Key",
    },
    gameType: "canvas",
  },
];

// Game categories for filtering
export const gameCategories = [
  { id: "all", name: "All Games", icon: "🎮" },
  { id: "action", name: "Action", icon: "⚔️" },
  { id: "racing", name: "Racing", icon: "🏎️" },
  { id: "puzzle", name: "Puzzle", icon: "🧩" },
  { id: "shooting", name: "Shooting", icon: "🚀" },
  { id: "horror", name: "Horror", icon: "👻" },
];

// Get games by category
export const getGamesByCategory = (category) => {
  if (category === "all") return games;
  return games.filter((game) => game.category === category);
};

// Get game by ID
export const getGameById = (id) => {
  return games.find((game) => game.id === parseInt(id));
};

// Search games
export const searchGames = (query) => {
  const searchTerm = query.toLowerCase();
  return games.filter(
    (game) =>
      game.title.toLowerCase().includes(searchTerm) ||
      game.description.toLowerCase().includes(searchTerm) ||
      game.category.toLowerCase().includes(searchTerm)
  );
};

// Get popular games (high rating)
export const getPopularGames = (limit = 4) => {
  return games.sort((a, b) => b.rating - a.rating).slice(0, limit);
};

// Get random games
export const getRandomGames = (limit = 3) => {
  const shuffled = [...games].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};
