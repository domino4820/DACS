/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Cyberpunk/Edgerunner color palette
        cyberpunk: {
          primary: "#f700ff", // Neon pink
          secondary: "#00f6ff", // Neon cyan/blue
          yellow: "#ffde00", // Neon yellow
          red: "#ff0040", // Neon red
          green: "#0fff50", // Neon green
          purple: "#bf00ff", // Neon purple
          dark: "#0d0e19", // Deep dark blue-black
          darker: "#070814", // Almost black
          light: "#2d325b", // Midnight blue
        },
        // UI component colors remapped to cyberpunk theme
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
      },
      backgroundImage: {
        "cyber-grid":
          "linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
        "cyber-gradient": "linear-gradient(180deg, #0d0e19 0%, #151934 100%)",
        "neon-glow":
          "radial-gradient(circle, rgba(0,246,255,0.15) 0%, rgba(0,0,0,0) 70%)",
      },
      boxShadow: {
        "neon-pink": "0 0 5px #f700ff, 0 0 10px #f700ff, 0 0 15px #f700ff",
        "neon-blue": "0 0 5px #00f6ff, 0 0 10px #00f6ff, 0 0 15px #00f6ff",
        "neon-yellow": "0 0 5px #ffde00, 0 0 10px #ffde00, 0 0 15px #ffde00",
        "neon-green": "0 0 5px #0fff50, 0 0 10px #0fff50, 0 0 15px #0fff50",
      },
      fontFamily: {
        cyber: ["Orbitron", "Rajdhani", "Roboto", "sans-serif"],
        "mono-cyber": ["Share Tech Mono", "monospace"],
      },
      animation: {
        "text-glitch": "text-glitch 3s infinite",
        "neon-pulse": "neon-pulse 2s infinite",
        "scan-line": "scan-line 2s linear infinite",
      },
      keyframes: {
        "text-glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "10%": { transform: "translate(-2px, 2px)" },
          "20%": { transform: "translate(2px, -2px)" },
          "30%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(2px, -2px)" },
          "50%": { transform: "translate(-2px, 2px)" },
          "60%": { transform: "translate(2px, -2px)" },
          "70%": { transform: "translate(-2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "90%": { transform: "translate(-2px, 2px)" },
        },
        "neon-pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
