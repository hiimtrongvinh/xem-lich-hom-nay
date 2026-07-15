/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/pages/**/*.vue",
    "./app/app.vue",
    "./app/assets/css/**/*.css"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
