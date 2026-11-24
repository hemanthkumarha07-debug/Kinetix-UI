/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
          active: 'var(--bg-surface-active)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          signal: 'var(--accent-signal)',
        },
        status: {
          ok: 'var(--status-ok)',
          warn: 'var(--status-warn)',
          err: 'var(--status-err)',
        },
      },
      boxShadow: {
        'specular-top': 'var(--specular-top)',
        'elevation-dark': '0 0 0 1px var(--border-subtle), 0 12px 32px -8px rgba(0,0,0,0.65), 0 4px 12px -2px rgba(0,0,0,0.45), var(--specular-top)',
        'elevation-light': '0 0 0 1px var(--border-subtle), 0 12px 32px -8px rgba(0,0,0,0.08), 0 4px 12px -2px rgba(0,0,0,0.04), var(--specular-top)',
        'focus-ring': '0 0 0 2px var(--bg-canvas), 0 0 0 4px var(--accent-signal)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
