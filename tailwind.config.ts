import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        border: "var(--border)",
        darkline: "#503047",
        primary: {
          DEFAULT: "var(--primary)",
          contrast: "var(--primary-contrast)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        arcade: {
          purple: "#503047", // Blackberry Cream
          yellow: "#C05746", // Rosy Copper
          pink: "#C05746",   // Rosy Copper
          mint: "#ADC698",   // Muted Olive
          blue: "#ADC698",   // Muted Olive
          dark: "#503047",   // Blackberry Cream
          cream: "#D0E3C4",  // Tea Green
        },
        palette: {
          copper: "#C05746", // Rosy Copper
          olive: "#ADC698",  // Muted Olive
          tea: "#D0E3C4",    // Tea Green
          white: "#FFFFFF",  // White
          blackberry: "#503047", // Blackberry Cream
        },
        rarity: {
          common: "#8E8EA0",
          rare: "#ADC698",
          epic: "#503047",
          legendary: "#C05746",
        },
        cat: {
          senang: "#FF6B6B",
          self: "#2FBF71",
          tech: "#3D8BFD",
          psikologi: "#A66CFF",
          matematika: "#F5A524",
          game: "#FF5CAA",
          kreatif: "#00B8D9",
          fisik: "#7CB518",
          sosial: "#FF8A4C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "20px",
        xl: "28px",
        pill: "9999px",
      },
      boxShadow: {
        retro: "4px 4px 0px #503047",
        "retro-xs": "1px 1px 0px #503047",
        "retro-sm": "2px 2px 0px #503047",
        "retro-lg": "6px 6px 0px #503047",
        "retro-xl": "8px 8px 0px #503047",
        "retro-dark": "4px 4px 0px #2D1A27",
      },
    },
  },
  plugins: [],
};

export default config;
