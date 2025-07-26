export type ColorType =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"

export interface ColorList {
  id: number
  label: string
  foreground: "white" | "black"
  background: ColorType
  properties: {
    borderColor: string
    mainAccent: string
    secondaryAccent: string
  }
}

export const COLOR_THEME_LIST: ColorList[] = [
  {
    id: 1,
    label: "Grey",
    background: "default",
    foreground: "white",
    properties: {
      mainAccent: "#1e1e1e",
      secondaryAccent: "#1e1e1e",
      borderColor: "#333435",
    },
  },
  {
    id: 2,
    label: "Blue",
    background: "primary",
    foreground: "white",
    properties: {
      mainAccent: "#181d22",
      secondaryAccent: "#1e242b",
      borderColor: "#25313f",
    },
  },
  {
    id: 3,
    label: "Green",
    background: "success",
    foreground: "black",
    properties: {
      mainAccent: "#181e1a",
      secondaryAccent: "#1b211d",
      borderColor: "#1b3022ff",
    },
  },
  {
    id: 4,
    label: "Purple",
    background: "secondary",
    foreground: "white",
    properties: {
      mainAccent: "#1e171f",
      secondaryAccent: "#221b23",
      borderColor: "#2d212a",
    },
  },
  {
    id: 5,
    label: "Orange",
    background: "warning",
    foreground: "black",
    properties: {
      mainAccent: "#1c1a15",
      secondaryAccent: "#231f16",
      borderColor: "#35312b",
    },
  },
  {
    id: 6,
    label: "Red",
    background: "danger",
    foreground: "white",
    properties: {
      mainAccent: "#251d1d",
      secondaryAccent: "#251d1d",
      borderColor: "#331f23",
    },
  },
]

export const getColorThemeById = (id: number): ColorList => {
  const colorTheme = COLOR_THEME_LIST.find(color => color.id === id)

  return colorTheme ?? COLOR_THEME_LIST[0]
}
