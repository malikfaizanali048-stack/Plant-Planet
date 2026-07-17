import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand green (dark, professional — not neon)
        forest: {
          50: "#f1f6f2",
          100: "#dfe9e0",
          200: "#bdd3c1",
          300: "#93b699",
          400: "#68966f",
          500: "#4a7a52",
          600: "#396140",
          700: "#2f4e35",
          800: "#1f3524", // primary brand color
          900: "#152619",
        },
        // Soft beige / cream backgrounds
        sand: {
          50: "#fdfcf9",
          100: "#f8f4ec",
          200: "#f0e8d8",
          300: "#e6d9bf",
          400: "#d8c49f",
          500: "#c4a875",
        },
        gold: {
          400: "#d4a94a",
          500: "#c2952f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-fraunces)", "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
