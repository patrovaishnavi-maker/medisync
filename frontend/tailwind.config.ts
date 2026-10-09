import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1769D2",
          50: "#F3F8FF",
          100: "#E3EFFD",
          200: "#C4DCFA",
          300: "#94C1F6",
          400: "#5CA0F0",
          500: "#1769D2",
          600: "#1254B0",
          700: "#0F428D",
          800: "#103975",
          900: "#12315B",
        },
        navy: {
          DEFAULT: "#12315B",
          50: "#F0F5FA",
          100: "#DCE7F3",
          500: "#1E4B82",
          900: "#12315B",
        },
        secondary: {
          DEFAULT: "#3687E8",
          light: "#EAF3FD",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8FAFC",
          muted: "#F3F8FF",
        },
        border: {
          DEFAULT: "#DCE7F3",
          subtle: "#E2E8F0",
        },
        typography: {
          main: "#1E293B",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(18, 49, 91, 0.05)",
        elevated: "0 10px 25px -5px rgba(18, 49, 91, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
