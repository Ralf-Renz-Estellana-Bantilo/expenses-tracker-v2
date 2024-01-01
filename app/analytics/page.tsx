import React from 'react'
import CategoryPercentageAnalytics from './CategoryPercentageAnalytics'
import AverageExpenses from './AverageExpenses'
import ExpensesGraph from './ExpensesGraph'

const AnalyticsPage = () =>
{
   return (
      <div className='flex flex-col gap-3'>
         <AverageExpenses />
         <ExpensesGraph />
         <CategoryPercentageAnalytics />
      </div>
   )
}

export default AnalyticsPage