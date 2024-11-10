/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  extend: {
    backgroundImage: {
      'imageBG': "url('/public/bg-img.png')",
    }
  },
  plugins: [],
}

