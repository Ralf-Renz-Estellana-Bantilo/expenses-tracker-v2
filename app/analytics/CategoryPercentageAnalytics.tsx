"use client"

import React, { useEffect, useRef, useState } from "react"
import { fetchMonthlyPercentageBreakdown } from "../controller/controller"
import { useSession } from "next-auth/react"
import { AnalyticsPercentageType } from "../types/type"
import { getCurrentMonth, setRandomColor } from "../utils/utils"
import { Button } from "@nextui-org/react"
import { EllipsisVertical } from "../icons/icons"
import SuspenseContainer from "../components/SuspenseContainer"

const CategoryPercentageAnalytics = () => {
  const { data: session } = useSession()
  const [percentageBreakdown, setPercentageBreakdown] = useState<
    AnalyticsPercentageType[]
  >([])
  const isPending = useRef(true)

  const user = session?.user?.email

  const getMonthlyPercentageBreakdown = async () => {
    if (user) {
      try {
        const response = (await fetchMonthlyPercentageBreakdown({
          user,
        })) as AnalyticsPercentageType[]
        response.sort((a, b) => Number(b.percentage) - Number(a.percentage))
        setPercentageBreakdown(response)
      } finally {
        isPending.current = false
      }
    }
  }

  useEffect(() => {
    getMonthlyPercentageBreakdown()
  }, [])

  return (
    <div className="flex flex-col p-3 border-1 border-border-color rounded-lg gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-center font-semibold text-accent-primary">
          Category Percentage Breakdown{" "}
          <code className="font-normal">({getCurrentMonth()})</code>
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
      <div className="flex flex-col gap-3">
        <SuspenseContainer data={percentageBreakdown}>
          {percentageBreakdown.map((data) => (
            <div className="flex flex-col" key={data.categoryID}>
              <div className="flex justify-between">
                <h3 className="text-sm text-accent-secondary">{`${data.categoryID} => ${data.category}`}</h3>
                <span className="text-sm text-accent-secondary">
                  {data.percentage}%
                </span>
              </div>
              <div className="flex rounded-md overflow-hidden">
                <div
                  className={`h-2 bg-slate-500`}
                  style={{
                    width: `${data.percentage}%`,
                    backgroundColor: `${setRandomColor(data.categoryID)}`,
                  }}
                />
                <div
                  style={{
                    width: `${100 - +data.percentage}%`,
                    backgroundColor: `${setRandomColor(data.categoryID)}`,
                    opacity: 0.1,
                  }}
                />
              </div>
            </div>
          ))}
        </SuspenseContainer>
      </div>
    </div>
  )
}

export default CategoryPercentageAnalytics
