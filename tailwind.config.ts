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
        background: "#ffffff",
        foreground: "#0f172a",
        f1: {
          blue: "#0284c7",
          sky: "#38bdf8",
          ice: "#e0f2fe",
          dark: "#082f49",
          cyan: "#06b6d4",
          accent: "#2563eb",
          silver: "#94a3b8",
        },
      },
      fontFamily: {
        f1: ["'Orbitron'", "'Chakra Petch'", "sans-serif"],
        racing: ["'Chakra Petch'", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(56, 189, 248, 0.25)',
        'glow-md': '0 0 30px rgba(56, 189, 248, 0.35)',
        'glow-lg': '0 0 45px rgba(56, 189, 248, 0.45)',
        'card': '0 4px 25px -4px rgba(14, 165, 233, 0.08), 0 2px 10px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 35px -10px rgba(14, 165, 233, 0.2), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(14, 165, 233, 0.08) 1px, transparent 1px)",
        'racing-stripes': "repeating-linear-gradient(45deg, rgba(56, 189, 248, 0.04), rgba(56, 189, 248, 0.04) 10px, transparent 10px, transparent 20px)",
      },
      keyframes: {
        speedline: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        speedline: 'speedline 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
