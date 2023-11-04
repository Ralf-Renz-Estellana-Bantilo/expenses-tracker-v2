'use client'

import React, { useState } from 'react'
import { AppContext } from '../context/context';
import { Button, Skeleton, useDisclosure } from '@nextui-org/react';
import { Wrapper, WrapperContent, WrapperFooter, WrapperHeader } from '../components/Wrapper';
import { BillIcon, PlusIcon } from '../icons/icons';
import { formatMoney, getExpenseDescription, getIcons } from '../utils/utils';
import ExpensesModal from '../components/modals/ExpensesModal';
import moment from 'moment';
import { TodaysExpensesType } from '../types/type';
import SuspenseContainer from '../components/SuspenseContainer';
import Image from 'next/image';
import { CardList, CardListSkeleton } from '../components/CardList';

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
                  {context?.isTodayExpensePending.current && <CardListSkeleton />}
                  {context?.todayExpenses?.map( ( expense ) => (
                     <CardList
                        key={expense.ID}
                        title={expense.category}
                        description={getExpenseDescription( expense.created_on ?? '', expense.description )}
                        iconName={getIcons( expense.categoryID ) as string}
                        value={formatMoney( expense.amount )}
                        handleDblClick={() => showExpenseDialog( expense )}
                     />
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