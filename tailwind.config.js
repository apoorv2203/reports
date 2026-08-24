/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — reference CSS custom properties from tokens.css
        // Components use e.g. bg-surface, text-text-primary, border-border
        // and theme switching works by changing the CSS vars.
        background: 'var(--color-background)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'surface-secondary': 'var(--color-surface-secondary)',
        'surface-tertiary': 'var(--color-surface-tertiary)',
        // Legacy named ramps — mapped to CSS vars for backward compatibility
        // so existing component classnames (bg-navy-900, text-ink-500, etc.)
        // resolve to the same values as before.
        navy: {
          900: 'var(--color-navy-900)',
          800: 'var(--color-navy-800)',
          700: 'var(--color-navy-700)',
          600: 'var(--color-navy-600)',
        },
        mint: {
          50: 'var(--color-primary-light)',
          100: 'var(--color-primary-lighter)',
          200: 'var(--color-primary-accent)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-medium)',
          500: 'var(--color-primary)',
          600: 'var(--color-success)',
          700: 'var(--color-success-hover)',
        },
        ink: {
          900: 'var(--color-ink-900)',
          700: 'var(--color-ink-700)',
          500: 'var(--color-ink-500)',
          400: 'var(--color-ink-400)',
          300: 'var(--color-ink-300)',
        },
        surface: {
          50: 'var(--color-surface-50)',
          100: 'var(--color-surface-100)',
          200: 'var(--color-surface-200)',
          DEFAULT: 'var(--color-surface)',
        },
        chart: {
          accent: 'var(--color-chart-accent)',
          'accent-light': 'var(--color-chart-accent-light)',
          'accent-lighter': 'var(--color-chart-accent-lighter)',
          'accent-lightest': 'var(--color-chart-accent-lightest)',
          green: 'var(--color-chart-green-stroke)',
          'green-fill': 'var(--color-chart-green-fill)',
          'green-accent': 'var(--color-chart-green-accent)',
          blue: 'var(--color-chart-blue)',
          'blue-medium': 'var(--color-chart-blue-medium)',
        },
        badge: {
          'purple-bg': 'var(--color-badge-purple-bg)',
          'purple-text': 'var(--color-badge-purple-text)',
          'green-bg': 'var(--color-badge-green-bg)',
          'green-text': 'var(--color-badge-green-text)',
          'blue-bg': 'var(--color-badge-blue-bg)',
          'blue-text': 'var(--color-badge-blue-text)',
          'amber-bg': 'var(--color-badge-amber-bg)',
          'amber-text': 'var(--color-badge-amber-text)',
          'yellow-bg': 'var(--color-badge-yellow-bg)',
          'yellow-text': 'var(--color-badge-yellow-text)',
          'red-bg': 'var(--color-badge-red-bg)',
          'red-text': 'var(--color-badge-red-text)',
        },
        link: 'var(--color-link)',
        param: {
          bg: 'var(--color-param-bg)',
        },
        'button-dark': 'var(--color-button-dark)',
        'success-light': 'var(--color-success-light)',
        'chart-green': 'var(--color-chart-green-stroke)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        floaty: 'var(--shadow-floaty)',
        card: 'var(--shadow-card)',
        'card-alt': 'var(--shadow-card-alt)',
        'card-dark': 'var(--shadow-card-dark)',
        'drawer-left': 'var(--shadow-drawer-left)',
        'drawer-right': 'var(--shadow-drawer-right)',
        'textarea-focus': 'var(--shadow-textarea-focus)',
        result: 'var(--shadow-result)',
        'result-sub': 'var(--shadow-result-sub)',
        'tab-active': 'var(--shadow-tab-active)',
        'chat-detail': 'var(--shadow-chat-detail)',
      },
    },
  },
  plugins: [],
};
