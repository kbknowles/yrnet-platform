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
          red: "#B22234",   // USA Red
          blue: "#3C3B6E",  // USA Blue
          black: "#000000",
        },
      },
    },
  },
  plugins: [],
};
