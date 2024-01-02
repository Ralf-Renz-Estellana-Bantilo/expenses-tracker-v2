"use client"

import { fetchMonthlyPercentageBreakdown } from "@/app/controller/controller"
import { setRandomColor } from "@/app/utils/utils"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 150 },
  { name: "Group D", value: 150 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const PieChartWithCustomizedLabel = () => {
  const { data: session } = useSession()
  const [percentageBreakdown, setPercentageBreakdown] = useState([])

  const user = session.user.email

  const getMonthlyPercentageBreakdown = async () => {
    const response = await fetchMonthlyPercentageBreakdown({ user })
    setPercentageBreakdown(response)
  }

  useEffect(() => {
    getMonthlyPercentageBreakdown()
  }, [])
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={600} height={600}>
        <Pie
          data={percentageBreakdown}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="total"
        >
          {percentageBreakdown.map((breakdown) => (
            <Cell
              key={`cell-${breakdown.categoryID}`}
              fill={setRandomColor(breakdown.categoryID)}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default PieChartWithCustomizedLabel
