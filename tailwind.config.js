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
        "4k": { min: "1921px" },
      },
      colors: {
        "history-dark": "#171717",
        "assistant-dark": "#212121",
        "input-dark": "#2F2F2F",
        "container-bg": "#f9fafb", // Background for content container
        "text-primary": "#333", // Main text color
        "highlight-bold": "#ff6347", // Bold text color
        "highlight-italic": "#007acc", // Italic text color
        "list-text": "#444", // List item color
        "link-color": "#007acc", // Link color
        "link-hover": "#005999", // Hover link color
        "code-bg": "#f0f0f0", // Code block background
        "syntax-bg": "#f5f5f5", // SyntaxHighlighter background
        "custom-bg": "rgba(17, 25, 40, 0.75)",
        "custom-border": "rgba(255, 255, 255, 0.125)",
      },
      spacing: {
        "container-p": "20px", // Padding for content container
        "list-padding": "1.5rem", // Custom list padding
        "list-margin": "8px", // List item margin
        "code-padding": "6px", // Padding inside code blocks
        "syntax-padding": "16px", // Padding for SyntaxHighlighter
      },
      borderRadius: {
        "container-radius": "12px", // Container border radius
        "code-radius": "4px", // Code block border radius
        "syntax-radius": "8px", // SyntaxHighlighter border radius
        12: "12px",
      },
      boxShadow: {
        "container-shadow": "0 4px 8px rgba(0, 0, 0, 0.05)", // Custom shadow for content container
      },
      fontSize: {
        "text-lg": "1.1rem", // Larger text size
        "syntax-text": "0.95rem", // SyntaxHighlighter font size
      },
      lineHeight: {
        "text-line": "1.6", // Line height for paragraphs
      },
      backgroundColor: {
        "landing-card": "#111928",
      },
      backgroundImage: {
        "landing-bg-image": "url('./assets/landing-bg.webp')",
      },
      backdropBlur: {
        16: "16px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "32px",
      },
    },
  },
  variants: {
    extend: {
      backdropFilter: ["responsive", "hover", "focus"],
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    // require('@tailwindcss/backdrop-filter'),
    // require('@tailwindcss/typography'),
  ],
};
