import React from "react"
import CategoryPercentageAnalytics from "./CategoryPercentageAnalytics"
import AverageExpenses from "./AverageExpenses"
import ExpensesGraph from "./ExpensesGraph"
import ReportGenerator from "./ReportGenerator"

const AnalyticsPage = () => {
  return (
    <div className="flex flex-col gap-3">
      <AverageExpenses />
      <ExpensesGraph />
      <CategoryPercentageAnalytics />
      <ReportGenerator />
    </div>
  )
}

export default AnalyticsPage
