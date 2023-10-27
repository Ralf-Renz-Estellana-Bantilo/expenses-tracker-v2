'use client'

import { Avatar } from '@nextui-org/react'
import React from 'react'
import { Wrapper, WrapperContent, WrapperFooter, WrapperHeader } from '../components/Wrapper'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { MONTHS_TABLE } from '../database/database'
import { formatMoney } from '../utils/utils'

const ProfilePage = () =>
{

   const { data: session } = useSession();

   if ( !session )
   {
      redirect( '/' )
   }

   return (
      <div className='flex flex-col gap-3'>
         <div className="flex flex-col items-center justify-center gap-1">
            <Avatar src={session.user?.image || "https://i.pravatar.cc/150?u=a042581f4e29026024d"} className="w-32 h-32 text-large" isBordered />
            <div className="flex flex-col items-center justify-center">
               <h2 className='text-accent-primary text-2xl font-bold text-center'>{session.user?.name}</h2>
               <small className='text-default-500 text-center'>{session.user?.email}</small>
            </div>
         </div>
         <Wrapper>
            <WrapperHeader className='flex items-center justify-between'>
               <h3 className='font-semibold text-accent-secondary'>Monthly Expenses</h3>
            </WrapperHeader>
            <WrapperContent className='flex flex-col'>
               {MONTHS_TABLE.sort( ( a, b ) => b.ID - a.ID ).map( month => (
                  <div className="flex p-2 justify-between items-center border-1 border-transparent hover:border-slate-700 rounded-lg hover:bg-slate-500 hover:backdrop-filter hover:backdrop-blur-sm hover:bg-opacity-10" key={month.ID}>
                     <div className="flex items-center gap-2">
                        <span>{month.description}</span>
                     </div>
                     <p className='text-accent-secondary font-semibold'>₱ {formatMoney( Math.floor( Math.random() * 5_000 ) )}</p>
                  </div>
               ) )}
            </WrapperContent>
            <WrapperFooter className='flex items-center justify-between'>
               <h3 className='text-default-500'>Total:</h3>
               <p className='text-default-500'>₱ 11,000</p>
            </WrapperFooter>
         </Wrapper>
      </div>
   )
}

export default ProfilePage