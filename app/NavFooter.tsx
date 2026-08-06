'use client'

import { Button, ButtonGroup } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppContext } from './context/context'
import { TabType } from './types/type'

const NavFooter = () => {
    const context = useAppContext()
    const router = useRouter()
    const pathname = usePathname()

    const { tabs, setActiveTab, selectedColor } = context

    const changeTab = (tab: TabType) => {
        setActiveTab(tab)
        router.push(tab.path)
    }

    return (
        <div className="z-10 flex sticky bottom-0 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
            <ButtonGroup
                fullWidth
                style={{
                    backgroundColor: `${selectedColor.properties.mainAccent}E6`,
                    borderTop: `1px solid ${selectedColor.properties.borderColor}`,
                }}
            >
                {tabs.map((tab) => {
                    const isActive = tab.path === pathname
                    return (
                        <Button
                            key={tab.ID}
                            className={`h-12 transition-all duration-200 rounded-none ${
                                isActive
                                    ? `bg-${selectedColor.background} text-${selectedColor.foreground} scale-[1.03]`
                                    : `bg-transparent text-default-500 hover:text-accent-primary`
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
