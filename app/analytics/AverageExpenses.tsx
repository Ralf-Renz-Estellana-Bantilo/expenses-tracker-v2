"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  fetchDailyExpenses,
  fetchMonthlyExpenses,
} from "../controller/controller"
import {
  AnalyticsDailyAverageType,
  AnalyticsMonthlyAverageType,
} from "../types/type"
import { formatMoney } from "../utils/utils"
import { AppContext } from "../context/context"

const AverageExpenses = () => {
  const { data: session } = useSession()
  const context = AppContext()

  const [average, setAverage] = useState({
    daily: 0,
    monthly: 0,
  })

  const user = session?.user?.email

  const getExpensesAverage = async () => {
    if (user) {
      const getDailyExpenses: AnalyticsDailyAverageType[] =
        await fetchDailyExpenses({ user })
      const getMonthlyExpenses: AnalyticsMonthlyAverageType[] =
        await fetchMonthlyExpenses({ user })

      setAverage({
        daily: getDailyExpenses[0].dailyAverage,
        monthly: getMonthlyExpenses[0].monthly_average,
      })
    }
  }

  useEffect(() => {
    getExpensesAverage()
  }, [])
  return (
    <div className="flex gap-3">
      <div className="flex flex-col border-1 border-border-color rounded-lg flex-1 p-2">
        <h3 className="text-center text-sm text-accent-secondary">
          Daily Expenses Average
        </h3>
        <span className="text-2xl font-semibold text-accent-primary text-center">
          {formatMoney(average.daily, context?.isMasked)}
        </span>
      </div>
      <div className="flex flex-col border-1 border-border-color rounded-lg flex-1 p-2">
        <h3 className="text-center text-sm text-accent-secondary">
          Monthly Expenses Average
        </h3>
        <span
          className="text-2xl font-semibold text-accent-primary
        text-center"
        >
          {formatMoney(average.monthly, context?.isMasked)}
        </span>
      </div>
    </div>
  )
}

export default AverageExpenses
