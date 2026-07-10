import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary, #1E1B4B)",
        secondary: "var(--secondary, #6D28D9)",
        accent: "var(--accent, #8B5CF6)",
        surface: "#F5F3FF",
        "dark-surface": "#1E1B4B",
        "dark-card": "#2E1065",
        brand: {
          50:  "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #6D28D9 0%, #4F46E5 100%)",
        "gradient-hero": "linear-gradient(135deg, #0C0A1A 0%, #1E1B4B 50%, #0C0A1A 100%)",
        "gradient-card": "linear-gradient(135deg, #2E1065 0%, #1E1B4B 100%)",
        "gradient-brand": "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 50%, #4F46E5 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(124, 58, 237, 0.6)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        "premium": "0 25px 50px -12px rgba(109,40,217,0.2), 0 0 0 1px rgba(167,139,250,0.1)",
        "card-hover": "0 32px 64px -12px rgba(109,40,217,0.25)",
        "glow-violet": "0 0 30px rgba(139,92,246,0.45)",
        "glow-indigo": "0 0 30px rgba(99,102,241,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
