export default {
  content: [
    './*.html',
    './about/**/*.html',
    './contact/**/*.html',
    './foundation-repair-cost/**/*.html',
    './hvac-cost/**/*.html',
    './plumbing-cost/**/*.html',
    './privacy-policy/**/*.html',
    './roofing-cost/**/*.html',
    './terms-of-service/**/*.html',
    './assets/js/**/*.js',
    './scripts/**/*.mjs'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#3a322f',
        ivory: '#fcfaf2',
        brand: '#884c31',
        'brand-light': '#a05a3b',
        dashed: '#d1cbbd',
        trust: '#1e293b',
        mist: '#f8fafc',
        action: '#8b5036',
        terracotta: '#8b5036',
        parchment: '#e8e2c4',
        caution: '#f59e0b'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15, 23, 42, 0.10)'
      }
    }
  },
  plugins: []
};

