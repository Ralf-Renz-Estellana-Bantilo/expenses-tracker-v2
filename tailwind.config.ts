import type { Config } from 'tailwindcss'
import { nextui } from "@nextui-org/react"


const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-primary': '#E7F1F3',
        'accent-secondary': '#CBDDE0',
        'border-color': '#25313f',
        'container-primary': '#181d22',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}
export default config
