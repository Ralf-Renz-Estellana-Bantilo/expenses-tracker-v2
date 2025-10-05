'use client'

import dynamic from 'next/dynamic'
import { Wrapper, WrapperContent, WrapperHeader } from '../components/Wrapper'
import { AppContext } from '../context/context'
import { ColorList } from '../database/colorThemeTable'
import { setCookie } from '../utils/helper'
import ColorTheme from './components/ColorTheme'

const ModeWithNoSSR = dynamic(() => import('./components/Mode'), {
    ssr: false,
})

const GeneralSettings = () => {
    const context = AppContext()
    const { selectedColor, setSelectedColor } = context

    const onChangeColorTheme = (color: ColorList) => {
        setCookie('colorThemeID', color.id.toString())
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
                <ColorTheme
                    selectedColor={selectedColor}
                    onChangeColorTheme={onChangeColorTheme}
                />
                <ModeWithNoSSR />
            </WrapperContent>
        </Wrapper>
    )
}

export default GeneralSettings
