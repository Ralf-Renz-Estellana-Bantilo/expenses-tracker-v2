'use client'

import { Avatar } from '@nextui-org/react'
import React from 'react'
import { Wrapper, WrapperContent, WrapperFooter, WrapperHeader } from '../components/Wrapper'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { formatMoney } from '../utils/utils'
import SuspenseContainer from '../components/SuspenseContainer'
import { AppContext } from '../context/context'
import Image from 'next/image'
import { CardList } from '../components/CardList'

const ProfilePage = () =>
{
   const context = AppContext()
   const { data: session } = useSession();

   if ( !session )
   {
      redirect( '/' )
   }

   let totalExpenses: number = context?.monthlyExpenses?.reduce( ( sum, item ) => Number( sum ) + Number( item.total ), 0 ) ?? 0

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
            <WrapperContent className='flex flex-col' scrollable>
               <SuspenseContainer data={context?.monthlyExpenses}>
                  {context?.monthlyExpenses?.map( ( month, index ) => (
                     <CardList
                        key={index}
                        iconName={month.monthCode}
                        title={month.month}
                        value={formatMoney( month.total )}
                     />
                  ) )}
               </SuspenseContainer>
            </WrapperContent>
            <WrapperFooter className='flex items-center justify-between'>
               <h3 className='text-default-500'>Total:</h3>
               <p className='text-default-500'> {formatMoney( totalExpenses )}</p>
            </WrapperFooter>
         </Wrapper>
      </div>
   )
}

export default ProfilePage