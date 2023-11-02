'use client'

import React, { useState } from 'react'
import { AppContext } from '../context/context';
import { Button, useDisclosure } from '@nextui-org/react';
import { Wrapper, WrapperContent, WrapperFooter, WrapperHeader } from '../components/Wrapper';
import { BillIcon, PlusIcon } from '../icons/icons';
import { formatMoney } from '../utils/utils';
import ExpensesModal from '../components/modals/ExpensesModal';
import moment from 'moment';
import { TodaysExpensesType } from '../types/type';
import SuspenseContainer from '../components/SuspenseContainer';

const TodaysExpenses = () =>
{
   const context = AppContext()
   const { isOpen, onOpen, onOpenChange } = useDisclosure();
   const [preview, setPreview] = useState<TodaysExpensesType | null>( null )

   const showExpenseDialog = ( expense: TodaysExpensesType | null ) =>
   {
      onOpen()
      setPreview( expense )
   }


   const totalTodaysExpenses: number = context?.todayExpenses?.reduce( ( accumulator, item ) => Number( accumulator ) + Number( item.amount ), 0 ) ?? 0

   return (
      <>
         <ExpensesModal isOpen={isOpen} data={preview} onOpenChange={onOpenChange} />
         <Wrapper>
            <WrapperHeader className='flex items-center justify-between'>
               <h3 className='font-semibold text-accent-secondary'>Today's Expenses</h3>
               <Button isIconOnly color="primary" size='sm' variant="light" aria-label="Take a photo" onPress={() => showExpenseDialog( null )}>
                  <PlusIcon />
               </Button>
            </WrapperHeader>
            <WrapperContent className='flex flex-col' scrollable>
               <SuspenseContainer data={context?.todayExpenses}>
                  {context?.todayExpenses?.map( ( expense, index ) => (
                     <div key={index} className="flex p-2 justify-between items-center border-1 cursor-pointer border-transparent hover:border-slate-700 rounded-lg hover:bg-slate-500 hover:backdrop-filter hover:backdrop-blur-sm hover:bg-opacity-10" onDoubleClick={() => showExpenseDialog( expense )}>
                        <div className="flex items-center gap-3">
                           <BillIcon />
                           <div className="flex flex-col">
                              <span>{expense.category}</span>
                              <small className='text-default-500 whitespace-nowrap overflow-clip text-ellipsis max-w-xs'>{moment( expense.created_on ).format( 'LT' )} {`${expense.description && `• ${expense.description}`}`}</small>
                           </div>
                        </div>
                        <span className='text-accent-secondary font-semibold'> {formatMoney( expense.amount )}</span>
                     </div>
                  ) )}
               </SuspenseContainer>
            </WrapperContent>
            <WrapperFooter className='flex items-center justify-between'>
               <h3 className='text-default-500'>Total:</h3>
               <p className='text-default-500'> {formatMoney( totalTodaysExpenses )}</p>
            </WrapperFooter>

         </Wrapper>
      </>
   )
}

export default TodaysExpenses