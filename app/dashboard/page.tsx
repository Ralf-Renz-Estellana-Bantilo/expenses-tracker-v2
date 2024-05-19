import React from "react"
import PreviousExpenses from "./PreviousExpenses"
import TodaysExpenses from "./TodaysExpenses"
import Summary from "./Summary"

const DashboardPage = async () => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Summary />
        <TodaysExpenses />
        <PreviousExpenses />
      </div>
    </>
  )
}

export default DashboardPage
