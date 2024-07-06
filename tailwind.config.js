/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["Cursive", "sans-serif"],
        dancing: ["Dancing", "sans-serif"],
        garamond: ["Garamond", "sans-serif"],
        libre: ["Libre", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        apple: ["Apple", "sans-serif"],
      },
      colors: {
        primaryPink: "#fff2fa",
        peach: "#ffe5db",
        primaryBlue: "#2f4858",
        golden: "#fee7db",
      },
    },
  },
  plugins: [],
};
