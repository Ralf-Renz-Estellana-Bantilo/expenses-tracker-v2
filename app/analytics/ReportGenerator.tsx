"use client"

import { Button } from "@nextui-org/react"
import React from "react"
import { EllipsisVertical } from "../icons/icons"
import { AppContext } from "../context/context"

const ReportGenerator = () => {
  const context = AppContext()
  if (!context) return null
  const { selectedColor } = context

  return (
    <div
      className={`flex flex-col p-3 border-1 border-${selectedColor.background}-border-color rounded-lg gap-2`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-center font-semibold text-accent-primary">
          Report
        </h3>
        <Button
          isIconOnly
          color="default"
          variant="light"
          aria-label="Take a photo"
        >
          <EllipsisVertical />
        </Button>
      </div>
      <div className="flex flex-col gap-3"></div>
    </div>
  )
}

export default ReportGenerator
