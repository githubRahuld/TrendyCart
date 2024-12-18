import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        aguDisplay: ["Agu Display", "sans-serif"],
        cinzelDecorative: ["Cinzel Decorative", "sans-serif"],
        eduAUVICWANT: ["Edu AU VIC WA NT", "sans-serif"],
        fascinateInline: ["Fascinate Inline", "sans-serif"],
      },
    },
  },

  darkMode: "class",
  plugins: [nextui()],
};
