import React from 'react'
import { Wrapper } from '../components/Wrapper'
import { redirect } from 'next/navigation'
import PreviousExpenses from './PreviousExpenses'
import TodaysExpenses from './TodaysExpenses'
import { getServerSession } from 'next-auth'

const DashboardPage = async () =>
{
   const session = await getServerSession();

   if ( !session ) return redirect( '/' )

   return (
      <>
         <div className='flex flex-col gap-3'>
            {/* SUMMARY */}
            <Wrapper className='flex flex-col'>
               <div className="flex items-center justify-between py-3">
                  <p className='text-accent-primary text-lg font-semibold'>Total Balance</p>
                  <span className='text-primary font-bold text-4xl'>₱ 300</span>
               </div>

               <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                     <p className='text-accent-secondary'>Total Budget</p>
                     <span className='text-accent-secondary font-medium'>₱ 11,300</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className='text-accent-secondary'>Total Expenses</p>
                     <span className='text-accent-secondary font-medium'>₱ 11,000</span>
                  </div>
               </div>
            </Wrapper>

            {/* TODAY'S EXPENSES */}
            <TodaysExpenses />

            {/* PREVIOUS EXPENSES */}
            <PreviousExpenses />
         </div>
      </>
   )
}

export default DashboardPage