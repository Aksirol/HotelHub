/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Тут ми потім зможемо додати фірмові кольори з Figma
        primary: "#1d4ed8",
        secondary: "#64748b",
      }
    },
  },
  plugins: [],
}