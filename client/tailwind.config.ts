import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Proxima Nova', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          200: 'rgb(var(--color-primary-200) / 1)',
          300: 'rgb(var(--color-primary-300) / 1)',
          400: 'rgb(var(--color-primary-400) / 1)',
          500: 'rgb(var(--color-primary-500) / 1)',
          600: 'rgb(var(--color-primary-600) / 1)',
          700: 'rgb(var(--color-primary-700) / 1)',
          800: 'rgb(var(--color-primary-800) / 1)',
          900: 'rgb(var(--color-primary-900) / 1)',
        },
        dark: '#0f172a',
        midnight: '#121063',
        metal: '#565584',
        tahiti: '#3ab7bf',
        silver: '#ecebff',
        bermuda: '#78dcca',
      },

      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
