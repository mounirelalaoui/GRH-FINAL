/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',
          400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',
          800:'#1e40af',900:'#1e3a8a',
        },
        sidebar: { DEFAULT:'#0f172a', hover:'#1e293b', active:'#1d4ed8' },
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] },
      animation: {
        'fade-in':  'fadeIn 0.2s ease-out forwards',
        'slide-in': 'slideIn 0.2s ease-out forwards',
        'scale-in': 'scaleIn 0.15s ease-out forwards',
        'skeleton': 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from:{opacity:0,transform:'translateY(4px)'}, to:{opacity:1,transform:'translateY(0)'} },
        slideIn: { from:{opacity:0,transform:'translateX(-12px)'}, to:{opacity:1,transform:'translateX(0)'} },
        scaleIn: { from:{opacity:0,transform:'scale(0.95)'}, to:{opacity:1,transform:'scale(1)'} },
        shimmer: { from:{backgroundPosition:'200% 0'}, to:{backgroundPosition:'-200% 0'} },
      },
    },
  },
  plugins: [],
}
