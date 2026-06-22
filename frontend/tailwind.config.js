/** @type {import('tailwindcss').Config} */
export default {
  // ═══════════════════════════════════════════════════════════════════════
  // CONTENT — Arquivos que o Tailwind vai escanear
  // ═══════════════════════════════════════════════════════════════════════
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // ═══════════════════════════════════════════════════════════════════════
  // THEME — Extensões do tema padrão
  // ═══════════════════════════════════════════════════════════════════════
  theme: {
    extend: {
      // ─────────────────────────────────────────────────────────────────
      // CORES — Identidade Visual Madson Motors
      // ─────────────────────────────────────────────────────────────────
      colors: {
        madson: {
          black: '#000000',
          gold: {
            light: '#F0D060',
            DEFAULT: '#D4AF37',
            dark: '#B8960C',
          },
          white: '#FFFFFF',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
        },
      },

      // ─────────────────────────────────────────────────────────────────
      // FONTES — Tipografia Madson Motors
      // ─────────────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Arial', 'Helvetica Neue', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },

      // ─────────────────────────────────────────────────────────────────
      // SOMBRAS — Customizadas
      // ─────────────────────────────────────────────────────────────────
      boxShadow: {
        'gold': '0 4px 14px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 8px 25px rgba(212, 175, 55, 0.4)',
        'inner-gold': 'inset 0 2px 4px rgba(212, 175, 55, 0.1)',
      },

      // ─────────────────────────────────────────────────────────────────
      // ANIMAÇÕES — Keyframes customizados
      // ─────────────────────────────────────────────────────────────────
      keyframes: {
        blob: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        pulseSlow: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
      },

      // ─────────────────────────────────────────────────────────────────
      // ANIMATION — Classes de animação
      // ─────────────────────────────────────────────────────────────────
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-left': 'slideInLeft 0.3s ease forwards',
        'slide-right': 'slideInRight 0.3s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
      },

      // ─────────────────────────────────────────────────────────────────
      // BORDER RADIUS — Extras
      // ─────────────────────────────────────────────────────────────────
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // ─────────────────────────────────────────────────────────────────
      // SPACING — Extras
      // ─────────────────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ─────────────────────────────────────────────────────────────────
      // Z-INDEX — Camadas customizadas
      // ─────────────────────────────────────────────────────────────────
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // ─────────────────────────────────────────────────────────────────
      // MIN/MAX HEIGHT — Utilitários
      // ─────────────────────────────────────────────────────────────────
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },

      // ─────────────────────────────────────────────────────────────────
      // BACKDROP BLUR — Efeitos de vidro
      // ─────────────────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PLUGINS — Extensões do Tailwind
  // ═══════════════════════════════════════════════════════════════════════
  plugins: [],
};
