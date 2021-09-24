// tailwind.config.js
module.exports = {
  important: true,
  // mode: 'jit',
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lorgablue: '#003c4d'
      },
      typography: {
        DEFAULT: {
          css: {
            'ol[type="A" s]': false,
            'ol[type="a" s]': false,
            'ol[type="I" s]': false,
            'ol[type="i" s]': false,
          }
        }
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['odd', 'even']
    },
    typography: []
  },
  plugins: [
    require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
};