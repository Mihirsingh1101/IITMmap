// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust if your files are elsewhere
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Your theme extensions from the previous example
      colors: {
        'brand-primary': '#002b36',
        'brand-secondary': '#0056b3',
        'brand-accent': '#ffb86c',
        'brand-blue': '#007bff',
        'cyan-accent': 'cyan',
        'light-bg': '#f0f9ff',
        'sidebar-bg': '#ffffff',
        'text-main': '#1f2937',
        'text-secondary': '#4b5563',
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      // ... any other extensions you had
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};