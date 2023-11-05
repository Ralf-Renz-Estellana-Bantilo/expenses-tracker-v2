'use client'

import React from 'react'
import { Wrapper } from '../components/Wrapper'
import { AppContext } from '../context/context'
import { formatMoney } from '../utils/utils'
import useCredit from '../hook/useCredit'

const Summary = () =>
{

   const context = AppContext()
   const { totalBalance, totalBudget, totalExpenses } = useCredit()

   return (
      <Wrapper className='flex flex-col'>
         <div className="flex items-center justify-between py-3">
            <p className='text-accent-primary text-lg font-semibold'>Total Balance</p>
            <span className='text-primary font-bold text-4xl'>{formatMoney( totalBalance, context?.isMasked )}</span>
         </div>

         <div className="flex gap-2">
            <div className="flex items-center justify-between border-1 border-green-800 bg-green-500 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg p-2 flex-1 max-[420px]:flex-col">
               <p className='text-accent-secondary text-sm'>Total Budget</p>
               <span className='text-accent-secondary font-bold'>{formatMoney( totalBudget, context?.isMasked )}</span>
            </div>
            <div className="flex items-center justify-between border-1 border-red-800 bg-red-500 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg p-2 flex-1 max-[420px]:flex-col">
               <p className='text-accent-secondary text-sm'>Total Expenses</p>
               <span className='text-accent-secondary font-bold'>{formatMoney( totalExpenses )}</span>
            </div>
         </div>
      </Wrapper>
   )
}

export default Summary