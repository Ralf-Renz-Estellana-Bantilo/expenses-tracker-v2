"use client"

import { Button } from "@nextui-org/react"
import { signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import React from "react"

const LogoutButton = () => {
  const handleSignOut = async () => {
    await signOut()
    redirect("/login")
  }

  return (
    <Button color="primary" onClick={handleSignOut}>
      Logout
    </Button>
  )
}

export default LogoutButton
