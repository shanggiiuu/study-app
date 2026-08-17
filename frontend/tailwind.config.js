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
          600: "#7548c7",
          700: "#623aab",
          800: "#51318b",
          900: "#432b70",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
