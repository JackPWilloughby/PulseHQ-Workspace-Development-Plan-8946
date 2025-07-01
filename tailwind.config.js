/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F0F11',
          surface: '#18181B',
          border: '#27272A',
          text: {
            primary: '#F5F5F7',
            secondary: '#A1A1AA',
            muted: '#71717A'
          }
        },
        accent: {
          red: '#EF4444',
          blue: '#3B82F6',
          green: '#22C55E'
        }
      },
      borderRadius: {
        'default': '12px'
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 120ms ease-out',
        'slide-up': 'slideUp 120ms ease-out',
        'glass-hover': 'glassHover 120ms ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        glassHover: {
          '0%': { backdropFilter: 'blur(0px)' },
          '100%': { backdropFilter: 'blur(8px)' }
        }
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}