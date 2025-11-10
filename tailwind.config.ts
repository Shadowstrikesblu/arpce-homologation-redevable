import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#af3338",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#8ba755",
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
