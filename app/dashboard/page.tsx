import React from 'react'
import PreviousExpenses from './components/PreviousExpenses'
import TodaysExpenses from './components/TodaysExpenses'
import Summary from './components/Summary'

const DashboardPage = async () => {
    return (
        <div className="flex flex-col gap-3">
            <Summary />
            <TodaysExpenses />
            <PreviousExpenses />
        </div>
    )
}

export default DashboardPage
