/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0f0f23", // deep black-blue
        card: "#1a1a2e", // dark card
        border: "#312e81", // purple border
        accent: "#9333ea", // purple accent
        accentLight: "#a855f7", // lighter purple
        text: "#f3f0ff", // off-white text
        textMuted: "#a1a1aa", // muted text
        error: "#ef4444",
      },
      boxShadow: {
        card: "0 4px 24px 0 rgba(173, 139, 115, 0.08)",
      },
      animation: {
        "pulse-accent": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
