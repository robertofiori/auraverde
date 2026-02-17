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
        "background-dark": "#020617", // Slate 950 - Premium deep dark
        "surface-light": "#ffffff",
        "surface-dark": "#0f172a", // Slate 900 - Slightly lighter for cards
      },
      fontFamily: {
        "display": ["Varela Round", "sans-serif"],
        "varela": ["Varela Round", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px"},
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
