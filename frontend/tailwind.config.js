/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: {
            light: '#F87171',
            DEFAULT: '#DC2626',
            dark: '#991B1B',
            deep: '#7F1D1D',
            crimson: '#E11D48',
          },
          white: {
            DEFAULT: '#FFFFFF',
            pearl: '#F8FAFC',
            rose: '#FFE4E6',
          },
          dark: {
            DEFAULT: '#0A0305',
            card: '#160A0E',
            surface: '#220E14',
            border: 'rgba(255, 255, 255, 0.14)',
          }
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Kanit', 'sans-serif'],
        serif: ['Noto Serif Thai', 'serif'],
      },
      boxShadow: {
        'red-glow': '0 0 30px rgba(220, 38, 38, 0.45)',
        'white-glow': '0 0 25px rgba(255, 255, 255, 0.35)',
        'glass-card': '0 10px 35px 0 rgba(0, 0, 0, 0.65)',
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #F87171 40%, #DC2626 70%, #991B1B 100%)',
        'white-red': 'linear-gradient(135deg, #FFFFFF 0%, #FFE4E6 45%, #EF4444 85%, #991B1B 100%)',
      }
    },
  },
  plugins: [],
}
