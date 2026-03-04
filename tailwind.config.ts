import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wd: {
          bg: "#08080A",
          surface: "#111114",
          card: "#16161A",
          border: "rgba(255,255,255,0.06)",
          "border-hov": "rgba(255,255,255,0.12)",
          text: "#F4F4F5",
          sub: "#A1A1AA",
          muted: "#52525B",
          gold: "#D4A843",
          "gold-glow": "rgba(212,168,67,0.15)",
        },
      },
      fontFamily: {
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["'Instrument Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
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
