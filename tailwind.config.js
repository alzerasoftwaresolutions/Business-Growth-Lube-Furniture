/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-ivory': '#F7F5F1',
        'soft-white': '#FFFFFF',
        'light-stone': '#E5E0D8',
        'dark-graphite': '#252321',
        'secondary-text': '#6B6863',
        'walnut': '#6B4632',
        'clay': {
          DEFAULT: '#B8613A',
          dark: '#964A2D',
          light: '#C9734C',
          subtle: '#F9EFEA'
        },
        'lube-border': '#DCD7CF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px -12px rgba(37, 35, 33, 0.12)',
        'lift': '0 20px 50px -20px rgba(37, 35, 33, 0.25)',
      },
      letterSpacing: {
        'editorial': '-0.02em',
        'headline': '-0.03em',
        'eyebrow': '0.12em',
      }
    },
  },
  plugins: [],
}
