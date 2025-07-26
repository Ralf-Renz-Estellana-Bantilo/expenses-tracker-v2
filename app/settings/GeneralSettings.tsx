"use client"

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"
import { Wrapper, WrapperContent, WrapperHeader } from "../components/Wrapper"
import { AppContext } from "../context/context"
import { COLOR_THEME_LIST, ColorList } from "../database/colorThemeTable"
import { setCookie } from "../utils/helper"

const GeneralSettings = () => {
  const context = AppContext()
  if (!context) return null
  const { selectedColor, setSelectedColor } = context

  const onChangeColorTheme = (color: ColorList) => {
    setCookie("colorThemeID", color.id.toString())
    setSelectedColor(color)
  }

  return (
    <Wrapper>
      <WrapperHeader className="flex items-center justify-between">
        <h3 className="font-semibold text-accent-secondary">
          General Settings
        </h3>
      </WrapperHeader>
      <WrapperContent className="flex flex-col">
        <div className="flex items-center justify-between">
          <span>Color Theme</span>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light">{selectedColor.label}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions">
              {COLOR_THEME_LIST.map((color) => (
                <DropdownItem
                  key={color.id}
                  color={color.background}
                  className={
                    color.id === selectedColor.id
                      ? `bg-${color.background} text-${color.foreground}`
                      : ""
                  }
                  onClick={() => onChangeColorTheme(color)}
                >
                  {color.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </WrapperContent>
    </Wrapper>
  )
}

export default GeneralSettings
