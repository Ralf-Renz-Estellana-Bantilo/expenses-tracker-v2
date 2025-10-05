import React from 'react'
import CategoryPercentageAnalytics from './components/CategoryPercentageAnalytics'
import AverageExpenses from './components/AverageExpenses'
import ExpensesGraph from './components/ExpensesGraph'

const AnalyticsPage = () => {
    return (
        <div className="flex flex-col gap-3">
            <AverageExpenses />
            <ExpensesGraph />
            <CategoryPercentageAnalytics />
        </div>
    )
}

export default AnalyticsPage
