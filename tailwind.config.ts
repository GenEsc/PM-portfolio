import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Emerald accent (single accent color across the whole site)
        accent: {
          DEFAULT: "#1D9E75", // verde esmeralda
          hover: "#0F6E56", // verde oscuro (hover)
          soft: "#E1F5EE", // verde muy claro (fondos)
          dark: "#5DCAA5", // variante para dark mode (scroll path)
        },
        // Theme-aware tokens backed by CSS variables (see globals.css)
        surface: {
          DEFAULT: "var(--bg)",
          secondary: "var(--bg-secondary)",
        },
        content: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        line: "var(--border)",
      },
      fontFamily: {
        // Headings
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        // Body
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Code / stack labels
        mono: ["var(--font-inter-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "h1-mobile": ["56px", { lineHeight: "1.05", fontWeight: "700" }],
        h1: ["72px", { lineHeight: "1.05", fontWeight: "700" }],
        "h2-mobile": ["36px", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["48px", { lineHeight: "1.1", fontWeight: "700" }],
        h3: ["26px", { lineHeight: "1.2", fontWeight: "600" }],
      },
      transitionTimingFunction: {
        // Gentle bounce used by the "pop" enter animation
        pop: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.6)", opacity: "0.4" },
        },
      },
      animation: {
        "pulse-dot": "pulse 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
