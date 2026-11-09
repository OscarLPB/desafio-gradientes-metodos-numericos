/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        umsa: {
          blue: '#002B49',
          gold: '#C59B27',
          light: '#F4F7FB',
          dark: '#0B132B',
        }
      }
    },
  },
  plugins: [],
}
