import { COLOR_THEME_LIST, ColorList } from '@/app/database/colorThemeTable'
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@nextui-org/react'

export default function ColorTheme({
    onChangeColorTheme,
    selectedColor,
}: {
    selectedColor: ColorList
    onChangeColorTheme: (color: ColorList) => void
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="ml-3">Color Theme</span>
            <Dropdown>
                <DropdownTrigger>
                    <Button variant="light" color={selectedColor.background}>
                        {selectedColor.label}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dynamic Actions">
                    {COLOR_THEME_LIST.map((color) => (
                        <DropdownItem
                            key={color.id}
                            color={color.background}
                            className={
                                color.id === selectedColor.id
                                    ? `bg-${color.background} text-${color.foreground}`
                                    : ''
                            }
                            onClick={() => onChangeColorTheme(color)}
                        >
                            {color.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}
