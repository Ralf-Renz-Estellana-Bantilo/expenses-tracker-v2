"use client"

import React from "react"
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react"
import {
  AnalyticsIcon,
  BackIcon,
  EyeOutlineIcon,
  EyeSlashOutlineIcon,
  FilterIcon,
  LogoutIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from "./icons/icons"
import { AppContext } from "./context/context"
import { redirect, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

const Header = ({
  title,
  showActions,
}: {
  title?: string
  showActions?: boolean
}) => {
  const context = AppContext()
  const { data: session } = useSession()
  const router = useRouter()

  if (!context) return null

  const handleSignOut = () => {
    signOut()
    redirect("/login")
  }

  const handleChangeRoute = (path: string) => {
    router.push(path)
  }

  const toggleMask = () => {
    const { setIsMasked, isMasked } = context
    const newValue = !isMasked
    localStorage.setItem("isMasked", `${newValue}`)
    setIsMasked(newValue)
  }

  const backToDashboard = () => {
    const { setActiveTab } = context

    handleChangeRoute("/dashboard")
    setActiveTab(context?.tabs[0])
  }

  return (
    <>
      <div className="z-20 flex items-center justify-between p-2 sticky top-0 border-b-1 border-border-color bg-container-primary">
        <div className="flex items-center gap-2">
          {title && (
            <Button
              isIconOnly
              color="default"
              variant="light"
              aria-label="Back Icon"
              onClick={backToDashboard}
            >
              <BackIcon />
            </Button>
          )}

          <h3 className="font-bold text-accent-primary text-lg">
            {title ? title : context?.activeTab.description}
          </h3>
        </div>

        <div className="flex gap-2">
          {showActions ||
            (showActions === undefined && (
              <>
                <Button
                  isIconOnly
                  color="default"
                  variant="light"
                  aria-label="Configuration Icon"
                  onClick={() => handleChangeRoute("/configurations")}
                >
                  <FilterIcon />
                </Button>
                <Button
                  isIconOnly
                  color="default"
                  variant="light"
                  aria-label="Search Icon"
                  onClick={() => handleChangeRoute("/search")}
                >
                  <SearchIcon />
                </Button>
              </>
            ))}
          <Dropdown className="dark bg-container-primary border-1 border-border-color">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                src={
                  session?.user?.image ??
                  "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                }
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                onClick={() => handleChangeRoute("/profile")}
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">
                  {session?.user?.email ?? "nouser@gmail.com"}
                </p>
              </DropdownItem>
              <DropdownItem
                key="analytics"
                onClick={() => handleChangeRoute("/analytics")}
              >
                <span className="flex gap-2">
                  <AnalyticsIcon />
                  Analytics
                </span>
              </DropdownItem>
              <DropdownItem
                key="configurations"
                onClick={() => handleChangeRoute("/configurations")}
              >
                <span className="flex gap-2">
                  <FilterIcon />
                  Configurations
                </span>
              </DropdownItem>
              <DropdownItem key="mask" onClick={toggleMask}>
                <span className="flex gap-2">
                  {context?.isMasked ? (
                    <EyeOutlineIcon />
                  ) : (
                    <EyeSlashOutlineIcon />
                  )}
                  {context?.isMasked ? "Disable Mask" : "Enable Mask"}
                </span>
              </DropdownItem>
              <DropdownItem
                key="actions"
                onClick={() => handleChangeRoute("/actions")}
              >
                <span className="flex gap-2">
                  <StarIcon />
                  Action Center
                </span>
              </DropdownItem>
              <DropdownItem
                key="settings"
                onClick={() => handleChangeRoute("/settings")}
              >
                <span className="flex gap-2">
                  <SettingsIcon />
                  Settings
                </span>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
                <span className="flex gap-2">
                  <LogoutIcon />
                  Log Out
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </>
  )
}

export default Header
