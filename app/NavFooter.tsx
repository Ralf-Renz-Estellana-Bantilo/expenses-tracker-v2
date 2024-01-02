"use client"

import React from "react"
import { AppContext } from "./context/context"
import { Button, ButtonGroup } from "@nextui-org/react"
import { TabType } from "./types/type"
import { useRouter, usePathname } from "next/navigation"

const NavFooter = () => {
  const context = AppContext()
  const router = useRouter()
  const pathname = usePathname()

  const changeTab = (tab: TabType) => {
    if (context) {
      const { setActiveTab } = context
      setActiveTab(tab)
      router.push(tab.path)
    }
  }

  return (
    <div className="z-10 flex sticky bottom-0">
      <ButtonGroup
        className="bg-container-primary border-t-1 border-border-color"
        fullWidth
      >
        {context?.tabs.map((tab) => {
          const isActive = tab.path === pathname
          return (
            <Button
              key={tab.ID}
              className={`h-12 ${
                isActive
                  ? "bg-primary"
                  : "bg-container-primary text-default-500"
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
