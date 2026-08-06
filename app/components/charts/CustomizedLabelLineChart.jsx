'use client'

import { ResponseCacheContext } from '@/app/context/cacheContext'
import { fetchPastWeekExpense } from '@/app/controller/controller'
import { formatDate, setRandomColor } from '@/app/utils/utils'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const CustomizedAxisTick = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="end"
                fill="#666"
                transform="rotate(-35)"
            >
                {payload.value}
            </text>
        </g>
    )
}

const CustomizedLabelLineChart = () => {
    const cacheContext = ResponseCacheContext()

    const [pastWeekExpenses, setPastWeekExpenses] = useState([])
    const [categories, setCategories] = useState([])

    const getPastWeekExpenses = async () => {
        if (cacheContext) {
            const { saveToCache, getCacheByID } = cacheContext

            const pastExpCacheID = `${moment().format('l')}-${'pwe'}`
            const categoryCacheID = `${moment().format('l')}-${'cat'}`

            const pastExpCacheData = getCacheByID(pastExpCacheID)
            const categoryCacheData = getCacheByID(categoryCacheID)

            if (pastExpCacheData) {
                setCategories(categoryCacheData)
                setPastWeekExpenses(pastExpCacheData)
            } else {
                const result = []
                const categoryList = []
                const response = await fetchPastWeekExpense()

                const uniqueDate = [
                    ...new Set(response.map(({ date }) => date)),
                ]
                const uniqueCategory = [
                    ...new Set(response.map(({ categoryID }) => categoryID)),
                ]

                uniqueCategory.forEach((categoryID) => {
                    const category = response.find(
                        ({ categoryID }) => categoryID
                    )?.category
                    categoryList.push({
                        categoryID,
                        category,
                    })
                })

                uniqueDate.forEach((date) => {
                    const obj = {}
                    obj.date = formatDate(date)
                    uniqueCategory.forEach((categoryID) => {
                        obj[`${categoryID}`] = 0
                    })

                    const expensesPerDate = response.filter(
                        (res) => res.date == date
                    )
                    expensesPerDate.forEach((expense) => {
                        obj[`${expense.categoryID}`] += Number(expense.amount)
                        obj[`${expense.category}`] = expense.category
                    })

                    result.push(obj)
                })

                const sortedList = categoryList.sort(
                    (a, b) => a.categoryID - b.categoryID
                )
                setCategories(sortedList)
                setPastWeekExpenses(result)

                saveToCache({
                    cacheID: pastExpCacheID,
                    data: result,
                })
                saveToCache({
                    cacheID: categoryCacheID,
                    data: sortedList,
                })
            }
        }
    }

    useEffect(() => {
        getPastWeekExpenses()
    }, [])

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={300}
                data={pastWeekExpenses}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    height={60}
                    tick={<CustomizedAxisTick />}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" /> */}
                {categories.map((category, index) => {
                    return (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={category.categoryID}
                            stroke={setRandomColor(category.categoryID)}
                        />
                    )
                })}
            </LineChart>
        </ResponsiveContainer>
    )
}

export default CustomizedLabelLineChart
