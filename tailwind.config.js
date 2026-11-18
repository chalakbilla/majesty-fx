/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#ff5a0a',
          dark: '#e04800',
        },
        navy: '#0b0f1a',
        ink: '#0f172a',
        muted: '#64748b',
        line: '#e5e7eb',
        card: '#ffffff',
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', '-apple-system', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Menlo', 'monospace'],
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
