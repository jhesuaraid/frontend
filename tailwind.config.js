/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
     'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        '20-80': '20% 80%',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      colors: {
        primary: {
          50: '#f5faff',
          100: '#e0f2ff',
          200: '#b3e1ff',
          300: '#80ccff',
          400: '#4db8ff',
          500: '#1aa3ff',
          600: '#008ae6',
          700: '#006bb3',
          800: '#004d80',
          900: '#002e4d',
        },
        base: 'rgb(40, 41, 43)',
        danger: 'rgb(217, 81, 65)',
        good: 'rgb(68, 142, 254)',
        fondo:'rgb(27, 27, 29)',
      },
      keyframes: {
        loading: {
          '0%, 100%': { marginTop: "25px", height: "10px"},
          '50%': {  marginTop: "0px", height: "50px" },
        },
      },
      animation: {
        loading: 'loading 1s ease-in-out infinite',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}