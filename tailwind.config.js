/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'rlcs-primary': 'var(--rlcs-primary)',
        'rlcs-secondary': 'var(--rlcs-secondary)',
        'rlcs-accent': 'var(--rlcs-accent)',
        'rlcs-dark': 'var(--rlcs-dark)',
        'rlcs-darker': 'var(--rlcs-darker)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};