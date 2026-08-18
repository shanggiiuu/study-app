/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "#f6f4fd",
          100: "#eee9fb",
          200: "#ded5f7",
          300: "#c5b6f0",
          400: "#a68ce5",
          500: "#8b65d8",
          600: "#6d5bd0",
          700: "#5b48b8",
          800: "#4a3a96",
          900: "#3c2f79",
        },
        cream: {
          50: "#fdfcfa",
          100: "#faf8f4",
          200: "#f3efe7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
