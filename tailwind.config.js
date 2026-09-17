/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1917",
        paper: "#f4efe6",
        panel: "#fffdf8",
        line: "#e7dcc8",
        cinnabar: "#9f1239",
        moss: "#3f6212",
      },
      fontFamily: {
        serif: ["Iwanami", "Songti TC", "STSong", "Noto Serif TC", "serif"],
        sans: ["PingFang TC", "Noto Sans TC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
