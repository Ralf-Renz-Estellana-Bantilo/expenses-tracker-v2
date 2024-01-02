import React from "react"
import { redirect } from "next/navigation"
import PreviousExpenses from "./PreviousExpenses"
import TodaysExpenses from "./TodaysExpenses"
import { getServerSession } from "next-auth"
import Summary from "./Summary"

const DashboardPage = async () => {
  const session = await getServerSession()

  if (!session) return redirect("/")

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* SUMMARY */}
        <Summary />

        {/* TODAY'S EXPENSES */}
        <TodaysExpenses />

        {/* PREVIOUS EXPENSES */}
        <PreviousExpenses />
      </div>
    </>
  )
}

export default DashboardPage
