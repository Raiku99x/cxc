/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── Slytherin Classroom Design Tokens ──
        // Backgrounds
        void:     "#f5f0e8",
        dungeon:  "#ede6d6",
        stone:    "#e4dcc8",
        moss:     "#d8ceb6",
        slate:    "#ccc0a4",
        iron:     "#b8aa8c",
        // Text
        mist:     "#8a7a5e",
        fog:      "#6b5c42",
        parchment:"#2c2218",
        bone:     "#1a1208",
        // Brand
        gold:     "#8a6318",
        "gold-bright": "#6b4c0e",
        "gold-dim":    "#a07828",
        // Status
        venom:    "#1a6b30",
        serpent:  "#1e8038",
        emerald:  "#166028",
        blood:    "#8b1c1c",
        crimson:  "#b02020",
        amethyst: "#5a3880",
        violet:   "#6e44a0",
        // Admin colors
        "admin-green":  "#1a7a3c",
        "admin-teal":   "#147a65",
        "admin-blue":   "#1e5fa0",
        "admin-amber":  "#a06010",
        "admin-red":    "#b83232",
      },
      fontFamily: {
        display: ["Cinzel_400Regular", "serif"],
        body:    ["CrimsonPro_400Regular", "serif"],
        mono:    ["JetBrainsMono_400Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
