"use client"

import { Avatar } from "@nextui-org/react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import React from "react"

const ProfileImage = () => {
  const { data: session } = useSession()

  if (!session) {
    redirect("/login")
  }
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <Avatar
        src={
          session.user?.image ||
          "https://i.pravatar.cc/150?u=a042581f4e29026024d"
        }
        className="w-32 h-32 text-large"
        isBordered
      />
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-accent-primary text-2xl font-bold text-center">
          {session.user?.name}
        </h2>
        <small className="text-default-500 text-center">
          {session.user?.email}
        </small>
      </div>
    </div>
  )
}

export default ProfileImage
