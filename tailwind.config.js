/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,js}'],
  darkMode: 'class', // ← enables dark mode via class
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2DD4BF',  // Teal-400
          dark: '#14B8A6',   // Teal-500
        },
        background: {
          light: '#ECFDF5',  // Green-50
          dark: '#0F172A',   // Slate-900
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B',   // Slate-800
        },
        text: {
          light: '#134E4A',  // Deep Teal
          dark: '#D1FAE5',   // Light Mint
        },
        muted: {
          light: '#D1FAE5',  // Border green-200
          dark: '#334155',   // Slate-700
        },
      },
    },
  },
  plugins: [],
};
