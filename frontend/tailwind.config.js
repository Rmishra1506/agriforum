/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGreen: '#006400', // Custom dark green color
        'custom-yellow': '#eae4e9',
      },
    },
  },
  plugins: [],
}
