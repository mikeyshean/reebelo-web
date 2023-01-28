/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        reebelo: {
          100: '#92F6F9',
          200: '#2B40E2',
          '200-hover': '#2436c1'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
