import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wd: {
          bg: "rgb(var(--wd-bg) / <alpha-value>)",
          surface: "rgb(var(--wd-surface) / <alpha-value>)",
          card: "rgb(var(--wd-card) / <alpha-value>)",
          text: "rgb(var(--wd-text) / <alpha-value>)",
          sub: "rgb(var(--wd-sub) / <alpha-value>)",
          muted: "rgb(var(--wd-muted) / <alpha-value>)",
          gold: "rgb(var(--wd-gold) / <alpha-value>)",
          blaze: "rgb(var(--wd-blaze) / <alpha-value>)",
          bone: "rgb(var(--wd-bone) / <alpha-value>)",
          ink: "rgb(var(--wd-ink) / <alpha-value>)",
          border: "var(--wd-border)",
          "border-hov": "var(--wd-border-hov)",
          "gold-glow": "var(--wd-gold-glow)",
          overlay: "rgb(var(--wd-overlay) / <alpha-value>)",
        },
      },
      fontFamily: {
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["'Instrument Sans'", "sans-serif"],
        mono: ["'Monaspace Krypton'", "'JetBrains Mono'", "monospace"],
        display: ["'Clash Display'", "'Archivo Black'", "sans-serif"],
      },
      boxShadow: {
        "wd-card": "var(--wd-card-shadow)",
        "wd-card-hover": "var(--wd-card-shadow-hover)",
      },
      animation: {
        "wd-bounce": "wd-bounce 2s ease infinite",
        "wd-float": "wd-float 4s ease-in-out infinite",
      },
      keyframes: {
        "wd-bounce": {
          "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
          "50%": { transform: "translateX(-50%) translateY(6px)" },
        },
        "wd-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
