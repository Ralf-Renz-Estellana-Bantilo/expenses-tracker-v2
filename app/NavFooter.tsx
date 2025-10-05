'use client'

import { Button, ButtonGroup } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'
import { AppContext } from './context/context'
import { TabType } from './types/type'

const NavFooter = () => {
    const context = AppContext()
    const router = useRouter()
    const pathname = usePathname()

    const { tabs, setActiveTab, selectedColor } = context

    const changeTab = (tab: TabType) => {
        setActiveTab(tab)
        router.push(tab.path)
    }

    return (
        <div className="z-10 flex sticky bottom-0">
            <ButtonGroup
                fullWidth
                style={{
                    backgroundColor: selectedColor.properties.mainAccent,
                    borderTop: `1px solid ${selectedColor.properties.borderColor}`,
                }}
            >
                {tabs.map((tab) => {
                    const isActive = tab.path === pathname
                    return (
                        <Button
                            key={tab.ID}
                            className={`h-12 ${
                                isActive
                                    ? `bg-${selectedColor.background} text-${selectedColor.foreground}`
                                    : `bg-container-${selectedColor.background}-main text-default-500`
                            }`}
                            onClick={() => changeTab(tab)}
                        >
                            {tab.icon}
                        </Button>
                    )
                })}
            </ButtonGroup>
        </div>
    )
}

export default NavFooter
