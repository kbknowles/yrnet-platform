/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.js",
    "./components/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        ahsra: {
          red: "#b22234",   // USA Red
          blue: "#3C3B6E",  // USA Blue
          black: "#000000",
        },
      },
        fontFamily: {
         sans: ["Fira Sans", "system-ui", "sans-serif"],
    },
    },
  },

    plugins: [
    require("@tailwindcss/typography"),    ],
};


