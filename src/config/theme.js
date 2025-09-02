// Theme configuration for Gaming Fusion Hub
export const theme = {
  colors: {
    // Primary gaming colors
    primary: "#0ea5e9", // Electric blue
    primaryDark: "#0284c7",
    primaryLight: "#38bdf8",

    // Accent colors
    accent: "#d946ef", // Neon purple
    accentDark: "#c026d3",
    accentLight: "#e879f9",

    // Dark theme colors
    background: "#0f172a", // Deep dark blue
    backgroundSecondary: "#1e293b",
    backgroundTertiary: "#334155",

    // Text colors
    textPrimary: "#f8fafc",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",

    // Neon colors for effects
    neon: {
      green: "#39ff14",
      blue: "#1b03a3",
      purple: "#bf00ff",
      pink: "#ff1493",
      cyan: "#00ffff",
      orange: "#ff6600",
    },

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Animation durations
  animation: {
    fast: "0.15s",
    normal: "0.3s",
    slow: "0.5s",
    verySlow: "1s",
  },

  // Spacing
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    xxl: "4rem",
  },

  // Border radius
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  // Shadows
  shadows: {
    glow: "0 0 20px rgba(14, 165, 233, 0.5)",
    glowAccent: "0 0 20px rgba(217, 70, 239, 0.5)",
    neonGreen: "0 0 30px #39ff14",
    neonPurple: "0 0 30px #bf00ff",
    neonCyan: "0 0 30px #00ffff",
  },

  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// CSS Custom Properties for dynamic theming
export const cssVariables = {
  "--color-primary": theme.colors.primary,
  "--color-accent": theme.colors.accent,
  "--color-background": theme.colors.background,
  "--color-text-primary": theme.colors.textPrimary,
  "--animation-normal": theme.animation.normal,
  "--glow-primary": theme.shadows.glow,
  "--glow-accent": theme.shadows.glowAccent,
};
