/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "mobile-s": "320px",
        "mobile-m": "375px",
        "mobile-l": "420px",
        "mobile-xl": "475px",
      },
      colors: {
        primary: {
          pink: "#A5308A",
          black: "#272727",
          blue: "#4B5EAA",
        },
        secondary: {
          pink: "#7B2567",
        },
      },
      gridTemplateColumns: {
        "popup-1": "minmax(250px, 2fr) repeat(3, minmax(210px, 1fr))",
      },
      boxShadow: {
        "navbar-header":
          "0px -8px 10px rgba(0, 0, 0, 0.14), 0px -3px 14px rgba(0, 0, 0, 0.12), 0px -5px 5px rgba(0, 0, 0, 0.2)",
        container: "0px 8px 10px 0px #00000024",
        selected: "0 0 0 2px #fff, 0 0 0 4px #4B5EAA",
        unselected: "0 0 0 2px #fff, 0 0 0 4px #272727",
        "c-grey-white": "0 0 0 2px #BDBDBD, 0 0 0 4px #FFFFFF",
        "c-pink-white": "0 0 0 2px #A530BA, 0 0 0 4px #FFFFFF",
        "add-selected": "0 0 2px 1.5px #283cc6",
      },
    },
  },
  plugins: [],
};
