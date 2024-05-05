"use client"

import React, { useEffect, useRef, useState } from "react"
import { fetchMonthlyPercentageBreakdown } from "../controller/controller"
import { useSession } from "next-auth/react"
import { AnalyticsPercentageType } from "../types/type"
import {
  CURRENT_MONTHID,
  CURRENT_YEAR,
  getCurrentMonth,
  setRandomColor,
} from "../utils/utils"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"
import { EllipsisVertical } from "../icons/icons"
import SuspenseContainer from "../components/SuspenseContainer"
import { Wrapper } from "../components/Wrapper"
import { AppContext } from "../context/context"
import { ResponseCacheContext } from "../context/cacheContext"

type TMonthList = {
  monthID: number
  month: string
}

type TOptions = {
  user: string
  monthID: number
  year: number
}

const CURRENT_MONTH: TMonthList = {
  month: getCurrentMonth(),
  monthID: CURRENT_MONTHID,
}

const CategoryPercentageAnalytics = () => {
  const context = AppContext()
  const cacheContext = ResponseCacheContext()

  if (!context) return null

  const { data: session } = useSession()

  const user = session?.user?.email ?? ""

  const [percentageBreakdown, setPercentageBreakdown] = useState<
    AnalyticsPercentageType[]
  >([])
  const [monthList, setMonthList] = useState<TMonthList[]>([])
  const [selectedMonth, setSelectedMonth] = useState<TMonthList | null>(null)

  const onSelectMonth = async (item: TMonthList) => {
    if (context) {
      setSelectedMonth(item)
      getMonthlyPercentageBreakdown({
        user,
        monthID: item.monthID,
        year: CURRENT_YEAR,
      })
    }
  }

  const getMonthlyPercentageBreakdown = async (options?: TOptions) => {
    const DEFAULT_OPTION: TOptions = {
      user,
      monthID: CURRENT_MONTHID,
      year: CURRENT_YEAR,
    }
    const option = options ?? DEFAULT_OPTION
    try {
      if (cacheContext) {
        const { saveToCache, getCacheByID } = cacheContext
        const cacheID = `${option.monthID}-${option.year}-${"mpb"}`
        const cacheData = getCacheByID<AnalyticsPercentageType[]>(cacheID)

        if (cacheData) {
          setPercentageBreakdown(cacheData)
        } else {
          const response = (await fetchMonthlyPercentageBreakdown(
            option
          )) as AnalyticsPercentageType[]
          response.sort((a, b) => Number(b.percentage) - Number(a.percentage))
          setPercentageBreakdown(response)
          saveToCache({
            cacheID,
            data: response,
          })
        }
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    getMonthlyPercentageBreakdown()
    const result: TMonthList[] = []

    for (let index = 1; index <= CURRENT_MONTHID; index++) {
      result.push({
        month: getCurrentMonth(index),
        monthID: index,
      })
    }

    setMonthList(result.sort((a, b) => b.monthID - a.monthID))

    const previousExpenses = context?.previousExpenses ?? []
    const monthlyExpenseSummary: TMonthList =
      previousExpenses.length > 0
        ? {
            month: getCurrentMonth(previousExpenses[0].monthID),
            monthID: previousExpenses[0].monthID,
          }
        : CURRENT_MONTH
    setSelectedMonth(monthlyExpenseSummary)
  }, [])

  return (
    <Wrapper className="flex flex-col p-3 gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-center font-semibold text-accent-primary">
          Category Percentage Breakdown
        </h3>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light">{selectedMonth?.month}</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions">
            {monthList.map((item) => (
              <DropdownItem
                key={item.monthID}
                color={
                  item.monthID === selectedMonth?.monthID
                    ? "primary"
                    : "default"
                }
                className={
                  item.monthID === selectedMonth?.monthID ? "bg-primary" : ""
                }
                onClick={() => onSelectMonth(item)}
              >
                {item.month}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
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
    </Wrapper>
  )
}

export default CategoryPercentageAnalytics
