"use client"

import { Wrapper } from "@/app/components/Wrapper"
import { BillIcon, SavingsIcon, ShopListIcon } from "@/app/icons/icons"
import React from "react"

const ProfileSections = () => {
  return (
    <div className="flex items-center gap-3">
      <Wrapper className="flex-1 flex flex-col items-center gap-1 cursor-pointer">
        <SavingsIcon size="md" />
        <p className="text-accent-secondary text-sm">Savings</p>
      </Wrapper>
      <Wrapper className="flex-1 flex flex-col items-center gap-2 cursor-pointer">
        <ShopListIcon size="md" />
        <p className="text-accent-secondary text-sm">Shop List</p>
      </Wrapper>
      <Wrapper className="flex-1 flex flex-col items-center gap-2 cursor-pointer">
        <BillIcon size="md" />
        <p className="text-accent-secondary text-sm">Bills</p>
      </Wrapper>
    </div>
  )
}

export default ProfileSections
