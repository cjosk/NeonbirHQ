import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: "#FF00FF",
          purple: "#7F00FF",
          blue: "#00D1FF",
          dark: "#0B1120"
        }
      }
    }
  },
  plugins: []
};

export default config;
