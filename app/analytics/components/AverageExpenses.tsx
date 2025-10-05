'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
    fetchDailyExpenses,
    fetchMonthlyExpenses,
} from '../../controller/controller'
import {
    AnalyticsDailyAverageType,
    AnalyticsMonthlyAverageType,
} from '../../types/type'
import { formatMoney } from '../../utils/utils'
import { AppContext } from '../../context/context'
import { Wrapper } from '../../components/Wrapper'
import { ResponseCacheContext } from '../../context/cacheContext'
import moment from 'moment'

const AverageExpenses = () => {
    const { data: session } = useSession()
    const context = AppContext()
    const cacheContext = ResponseCacheContext()

    const [average, setAverage] = useState({
        daily: 0,
        monthly: 0,
    })

    const user = session?.user?.email

    const getExpensesAverage = async () => {
        if (user && cacheContext) {
            const { useResponse } = cacheContext
            const dailyExpCacheID = `${moment().format('l')}-${'dex'}`
            const monthlyExpCacheID = `${moment().format('l')}-${'mex'}`

            const getDailyExpenses = await useResponse<
                AnalyticsDailyAverageType[]
            >(dailyExpCacheID, () => fetchDailyExpenses())

            const getMonthlyExpenses = await useResponse<
                AnalyticsMonthlyAverageType[]
            >(monthlyExpCacheID, () => fetchMonthlyExpenses())

            let dailyAverage = 0
            if (getDailyExpenses) {
                dailyAverage = getDailyExpenses[0]?.dailyAverage
            }

            let monthlyAverage = 0
            if (getMonthlyExpenses) {
                monthlyAverage = getMonthlyExpenses[0]?.monthly_average
            }
            setAverage({
                daily: dailyAverage,
                monthly: monthlyAverage,
            })
        }
    }

    useEffect(() => {
        getExpensesAverage()
    }, [])
    return (
        <div className="flex gap-3">
            <Wrapper className="flex flex-col border-1 flex-1 p-2">
                <h3 className="text-center text-sm text-accent-secondary">
                    Daily Expenses Average
                </h3>
                <span className="text-2xl font-semibold text-accent-primary text-center">
                    {formatMoney(average.daily, context.isMasked)}
                </span>
            </Wrapper>
            <Wrapper className="flex flex-col border-1 flex-1 p-2">
                <h3 className="text-center text-sm text-accent-secondary">
                    Monthly Expenses Average
                </h3>
                <span
                    className="text-2xl font-semibold text-accent-primary
        text-center"
                >
                    {formatMoney(average.monthly, context.isMasked)}
                </span>
            </Wrapper>
        </div>
    )
}

export default AverageExpenses
