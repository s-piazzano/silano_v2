import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.6rem",
      },
      fontFamily: {
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        forest: "#516559",
        base: {
          100: "#F4F4F2",
          200: "#EEEEE8",
        },
      },
      animation: {
        openmenu: "openmenu 0.3s ease-in", // Animazione per l'apertura del menu
        closemenu: "closemenu 0.3s ease-in", // Animazione per la chiusura del menu
      },
      keyframes: {
        openmenu: {
          "0%": { right: "-600px" }, // Posizione iniziale
          "100%": { right: "0px" }, // Posizione finale
        },
        closemenu: {
          "0%": { right: "0px" }, // Posizione iniziale
          "100%": { right: "-224px" }, // Posizione finale
        },
      },
    },
  },
  plugins: [],
};
export default config;
