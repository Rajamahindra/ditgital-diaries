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
        primary: "#0F172A",
        secondary: "#2563EB",
        accent: "#7C3AED",
        surface: "#F8FAFC",
        "dark-surface": "#0F172A",
        "dark-card": "#1E293B",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
        "gradient-hero": "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        "gradient-card": "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
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
        "premium": "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.05)",
        "card-hover": "0 32px 64px -12px rgba(37, 99, 235, 0.3)",
        "glow-blue": "0 0 30px rgba(37, 99, 235, 0.4)",
        "glow-purple": "0 0 30px rgba(124, 58, 237, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
