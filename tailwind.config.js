module.exports = {
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        midnight: "#070311",
        panel: "#130d22",
        panelSoft: "#1c1432",
        line: "rgba(168, 85, 247, 0.15)",
        accent: "#9333ea",
        accentSoft: "#c084fc",
        cobalt: "#3f6cf6",
        emerald: "#2bd57f",
        ember: "#f57c32",
        gold: "#f5c441",
        magenta: "#b547d1"
      },
      fontFamily: {
        display: ["Bungee", "cursive"],
        body: ["Rajdhani", "sans-serif"]
      },
      boxShadow: {
        tile: "0 20px 40px rgba(0, 0, 0, 0.45)",
        glow: "0 0 40px rgba(168, 85, 247, 0.35)",
        lift: "0 12px 24px rgba(0, 0, 0, 0.45)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        float: "float 4s ease-in-out infinite"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
