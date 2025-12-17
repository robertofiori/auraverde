/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#13ec37",
        "background-light": "#f6f8f6",
        "background-dark": "#102213",
        "surface-light": "#ffffff",
        "surface-dark": "#1a2c1e",
      },
      fontFamily: {
        "display": ["Varela Round", "sans-serif"],
        "varela": ["Varela Round", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px"},
    },
  },
  plugins: [],
}
