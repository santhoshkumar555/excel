/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backdropBlur: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
    },
  },
  plugins: [],
}