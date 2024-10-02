/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        mob: { min: "320px", max: "480px" },
        "tab-p": { min: "481px", max: "768px" },
        "tab-l": { min: "769px", max: "1024px" },
        lap: { min: "1025px", max: "1200px" },
        "lap-lg": { min: "1201px", max: "1566px" },
        desktop: { min: "1567px", max: "1920px" },
      },
      colors: {
        "history-dark": "#171717",
        "assistant-dark": "#212121",
        "input-dark":"#2F2F2F"
      },
      height: {
        "100vh": "100vh",
        "77%":"77%",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
