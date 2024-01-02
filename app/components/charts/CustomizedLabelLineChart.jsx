"use client"

import { fetchPastWeekExpense } from "@/app/controller/controller"
import { formatDate, setRandomColor } from "@/app/utils/utils"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

const CustomizedLabel = ({ x, y, stroke, value }) => {
  return (
    <text
      x={x}
      y={y}
      dy={-4}
      fill={stroke}
      fontSize={10}
      className="text-white"
      textAnchor="middle"
      color="white"
    >
      {value}
    </text>
  )
}

const CustomizedAxisTick = ({ x, y, stroke, payload }) => {
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
  const { data: session } = useSession()

  const user = session.user.email

  const [pastWeekExpenses, setPastWeekExpenses] = useState([])
  const [categories, setCategories] = useState([])

  const getPastWeekExpenses = async () => {
    const result = []
    const categoryList = []
    const response = await fetchPastWeekExpense({ user })

    const uniqueDate = [...new Set(response.map(({ date }) => date))]
    const uniqueCategory = [
      ...new Set(response.map(({ categoryID }) => categoryID)),
    ]

    uniqueCategory.forEach((categoryID) => {
      const category = response.find(({ categoryID }) => categoryID)?.category
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

      const expensesPerDate = response.filter((res) => res.date == date)
      expensesPerDate.forEach((expense) => {
        obj[`${expense.categoryID}`] += Number(expense.amount)
        obj[`${expense.category}`] = expense.category
      })

      result.push(obj)
    })

    setCategories(categoryList.sort((a, b) => a.categoryID - b.categoryID))
    setPastWeekExpenses(result)
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
        <XAxis dataKey="date" height={60} tick={<CustomizedAxisTick />} />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" /> */}
        {categories.map((category) => {
          return (
            <Line
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
