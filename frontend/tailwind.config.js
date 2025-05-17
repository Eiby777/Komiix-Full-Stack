module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a',
          dark: '#93c5fd'
        },
        secondary: {
          DEFAULT: '#2563eb',
          dark: '#60a5fa'
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#121212'
        },
        text: {
          DEFAULT: '#1e293b',
          dark: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
