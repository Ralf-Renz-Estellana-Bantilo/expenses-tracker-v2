import type { Config } from "tailwindcss"
import { nextui } from "@nextui-org/react"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent-primary": "#E7F1F3",
        "accent-secondary": "#CBDDE0",
        "border-color": "#25313f",
        "container-primary": "#181d22",
        "container-secondary": "#1e242b",

        "container-default-main": "#1b1b1b",
        "container-default-secondary": "#282a2c",
        "default-border-color": "#333435",

        "container-primary-main:": "#181d22",
        "container-primary-secondary": "#1e242b",
        "primary-border-color": "#25313f",

        "container-secondary-main": "#1e171f",
        "container-secondary-secondary": "#251921",
        "secondary-border-color": "#3f2539",

        "container-success-main": "#09120b",
        "container-success-secondary": "#1e242b",
        "success-border-color": "#253f2e",

        "container-warning-main": "#181202",
        "container-warning-secondary": "#1e242b",
        "warning-border-color": "#3f3425",

        "container-danger-main": "#181212",
        "container-danger-secondary": "#1e242b",
        "danger-border-color": "#3f252b",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
export default config
