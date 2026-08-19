/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0E2A3B',
          800: '#132A3A',
          700: '#1B3A4E',
          600: '#27506B',
        },
        mint: {
          50: '#E9FBF4',
          100: '#D0F7E8',
          200: '#A8F0D6',
          300: '#7BE8C2',
          400: '#5EEAB0',
          500: '#3DD998',
          600: '#23B27C',
          700: '#1A8A61',
        },
        ink: {
          900: '#132A3A',
          700: '#2A4A5E',
          500: '#6B7B87',
          300: '#A6B3BC',
        },
        surface: {
          50: '#F7F8F9',
          100: '#EEF1F3',
          200: '#E2E7EA',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(14, 42, 59, 0.06), 0 1px 3px rgba(14, 42, 59, 0.04)',
        floaty: '0 4px 16px rgba(14, 42, 59, 0.08)',
      },
    },
  },
  plugins: [],
};
