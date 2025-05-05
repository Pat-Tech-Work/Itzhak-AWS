/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1e3a8a',
        'secondary': '#fbbf24',
        'dark': '#1f2937',
      },
      screens: {
        'sm': '640px', // מסך קטן
        'md': '768px', // מסך בינוני
        'lg': '1024px', // מסך גדול
        'xl': '1280px', // מסך רחב מאוד
      },
    },
  },
  plugins: [],
}
