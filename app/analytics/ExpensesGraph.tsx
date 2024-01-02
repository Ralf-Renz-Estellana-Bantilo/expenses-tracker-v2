"use client"

import React from "react"
import CustomizedLabelLineChart from "../components/charts/CustomizedLabelLineChart"
import { Button } from "@nextui-org/react"
import { EllipsisVertical } from "../icons/icons"

const ExpensesGraph = () => {
  return (
    <div className="flex flex-col p-3 gap-2 border-1 border-border-color rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-center font-semibold text-accent-primary">
          Expenses Graph ( Past 7 days )
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
      <div className="h-[50vh]">
        <CustomizedLabelLineChart />
      </div>
    </div>
  )
}

export default ExpensesGraph
