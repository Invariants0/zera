import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        obsidian: "#0a0a0a",
        obsidian_light: "#0c0c0c",
        lime: {
          DEFAULT: "#ccff00",
          hover: "#d4ff33",
          glow: "rgba(204, 255, 0, 0.3)",
        },
        emerald: {
          glow: "#10b981",
        },
        glass: {
          white: "rgba(255, 255, 255, 0.03)",
          border: "rgba(255, 255, 255, 0.1)",
        },
        text: {
          primary: "#ebebeb",
          secondary: "rgba(235, 235, 235, 0.6)",
          muted: "rgba(235, 235, 235, 0.3)",
        },
      },
      borderRadius: {
        "2.5rem": "2.5rem",
        "1.5rem": "1.5rem",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-60": "60px 60px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-fast": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      transitionTimingFunction: {
        curve: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
