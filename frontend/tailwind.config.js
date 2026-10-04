/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060a13',
        panel: '#0a1020',
        raised: '#0e1628',
        line: '#1a2540',
        'line-strong': '#2a3a60',
        ink: '#e6ebf5',
        muted: '#8b98b5',
        faint: '#5b6784',
        brand: { DEFAULT: '#2f80ff', hover: '#5a9dff' },
        accent: '#2dd4e6',
        ok: '#3ecf8e',
        warn: '#f5b94a',
        danger: '#f0616d',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        rise: { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'none' } },
        blink: { '0%, 80%, 100%': { opacity: 0.2 }, '40%': { opacity: 1 } },
      },
      animation: { rise: 'rise 160ms ease-out', blink: 'blink 1.2s infinite' },
    },
  },
  plugins: [],
};
