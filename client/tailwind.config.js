/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Resentii-inspired ESPACIO Palette ──
        bg: {
          DEFAULT: '#fafafa',   // near-white main background
          dark:    '#101014',   // near-black (hero/dark sections)
          card:    '#f4f4f6',   // subtle card bg
          deep:    '#28282c',   // dark cards/sidebar
        },
        ink: {
          DEFAULT: '#101014',   // primary text
          soft:    '#3d3d47',   // secondary text
          muted:   '#9b9ba8',   // placeholders
          border:  '#e6e6e6',   // borders
          line:    '#d0d1db',   // subtle lines
        },
        gold: {
          DEFAULT: '#C9A96E',   // warm luxury accent
          light:   '#E8D5AD',
          hover:   '#B8924A',
        },
        // legacy aliases kept for compat
        cream:    { DEFAULT: '#fafafa', light: '#f4f4f6' },
        offwhite: { DEFAULT: '#f4f4f6' },
        walnut:   { DEFAULT: '#3d3d47', dark: '#101014' },
        charcoal: { DEFAULT: '#101014', dark: '#28282c' },
      },
      fontFamily: {
        editorial: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        sans:      ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display:   ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card:   '16px',
        button: '8px',
        img:    '16px',
        input:  '8px',
        pill:   '999px',
      },
      letterSpacing: {
        widest2: '0.2em',
        tight2:  '-0.04em',
      },
      spacing: {
        '18': '72px',
        '22': '88px',
        '128': '512px',
        '160': '640px',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in':  'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      animation: {
        'infinite-scroll': 'scroll 40s linear infinite',
        'fade-up':   'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':   'fadeIn 0.5s ease forwards',
        'line-grow': 'lineGrow 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        scroll:   { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp:   { from: { opacity: '0', transform: 'translateY(32px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        lineGrow: { from: { scaleX: '0', transformOrigin: 'left' }, to: { scaleX: '1', transformOrigin: 'left' } },
      },
    },
  },
  plugins: [],
}
