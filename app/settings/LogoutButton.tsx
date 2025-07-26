"use client"

import { Button } from "@nextui-org/react"
import { signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import React from "react"
import { AppContext } from "../context/context"

const LogoutButton = () => {
  const context = AppContext()
  if (!context) return null

  const { selectedColor } = context

  const handleSignOut = async () => {
    await signOut()
    redirect("/login")
  }

  return (
    <Button
      className="font-bold"
      color={selectedColor.background}
      onClick={handleSignOut}
    >
      Logout
    </Button>
  )
}

export default LogoutButton
