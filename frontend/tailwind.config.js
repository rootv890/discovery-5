import fluid, { extract } from "fluid-tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    extract,
  },
  plugins: [fluid, require("tailwindcss-animated")],
  theme: {
    extend: {
      boxShadow: {
        // box-shadow: rgba(6, 36, 58, 0.2) 0px 7px 29px 0px;
        "card-lg": "0px 7px 29px 0px rgba(6, 36, 58, 0.2)",
      },

      borderRadius: {
        /*  --rounded: 0.5rem;
  --rounded-lg: 1rem;
  --rounded-full: 9999px; */

        md: "0.5rem",
        lg: "1rem",
        full: "9999px",
      },

      lineHeight: {
        vs: 1,
        s: 1.25,
        m: 1.375,
        l: 1.5,
        xl: 1.875,
        "2xl": 2.25,
        "3xl": 2.75,
      },

      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        body: "1rem",
        h5: "1.4rem",
        h4: "1.75rem",
        h3: "2.4rem",
        h2: "3.2rem",
        h1: "4.2rem",
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        fainted: "var(--fainted)",
        muted: "var(--muted)",

        // Brand
        // blue
        blue: {
          50: "var(--blue-50)",
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
          400: "var(--blue-400)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          800: "var(--blue-800)",
          900: "var(--blue-900)",
          950: "var(--blue-950)",
        },
        // green
        green: {
          50: "var(--green-50)",
          100: "var(--green-100)",
          200: "var(--green-200)",
          300: "var(--green-300)",
          400: "var(--green-400)",
          500: "var(--green-500)",
          600: "var(--green-600)",
          700: "var(--green-700)",
          800: "var(--green-800)",
          900: "var(--green-900)",
          950: "var(--green-950)",
        },
        // magenta
        magenta: {
          50: "var(--magenta-50)",
          100: "var(--magenta-100)",
          200: "var(--magenta-200)",
          300: "var(--magenta-300)",
          400: "var(--magenta-400)",
          500: "var(--magenta-500)",
          600: "var(--magenta-600)",
          700: "var(--magenta-700)",
          800: "var(--magenta-800)",
          900: "var(--magenta-900)",
          950: "var(--magenta-950)",
        },
        // orange
        orange: {
          50: "var(--orange-50)",
          100: "var(--orange-100)",
          200: "var(--orange-200)",
          300: "var(--orange-300)",
          400: "var(--orange-400)",
          500: "var(--orange-500)",
          600: "var(--orange-600)",
          700: "var(--orange-700)",
          800: "var(--orange-800)",
          900: "var(--orange-900)",
          950: "var(--orange-950)",
        },
      },

      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "serif"],
        futura: ["var(--font-futura-b)", "Anton", "Impact", "sans-serif"],
        "futura-oblique": [
          "var(--font-futura-bo)",
          "Anton",
          "Impact",
          "sans-serif",
        ],
      },
    },
  },
};
