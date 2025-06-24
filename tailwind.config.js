/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFBE9', // main page background, overlays, highlights
        card: '#E3CAA5',       // card/content backgrounds, large sections
        border: '#CEAB93',     // borders, dividers, iconography, button hovers
        accent: '#AD8B73',     // nav bars, titles, CTAs, important icons
        text: '#000000',       // main text, headings, icons
      },
    },
  },
  plugins: [],
};
