'use client'

import React, { ContextType, useState } from 'react'
import { AppContext } from '../context/context';
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Wrapper, WrapperContent, WrapperFooter, WrapperHeader } from '../components/Wrapper';
import { formatMoney } from '../utils/utils';
import { ExpensesType } from '../types/type';
import { BillIcon } from '../icons/icons';
import { CATEGORIES_TABLE } from '../database/database';
import moment from 'moment'

type PreviousExpenseType = {
   ID: number;
   date: string;
   total: number;
   expensesList: ExpensesType[];
}

const PreviousExpenses = () =>
{
   const context = AppContext()
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   const [preview, setPreview] = useState<PreviousExpenseType | null>( null )

   const previewExpense = ( expense: PreviousExpenseType ) =>
   {
      setPreview( expense )
      onOpen()
   }

   const findCategory = ( categoryID: number ) =>
   {
      return CATEGORIES_TABLE.find( category => category.ID === categoryID )
   }

   const hasPreviousExpenses = context?.previousExpenses && context?.previousExpenses.length > 0

   const totalPreviousExpenses = context?.previousExpenses.reduce( ( accumulator, item ) => accumulator + item.total, 0 ) ?? 0

   return (
      <>
         <Modal
            className='border-1 border-border-color bg-container-primary'
            backdrop='blur'
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
         >
            <ModalContent>
               {( onClose ) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1 font-bold">Expenses List</ModalHeader>
                     <ModalBody>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center border-1 border-border-color bg-slate-500 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg p-2 justify-between text-default-500 flex-1 ">
                              <h3>Date: </h3>
                              <span>{preview?.date}</span>
                           </div>
                           <div className="flex items-center border-1 border-border-color bg-slate-500 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg p-2 justify-between text-default-500 flex-1">
                              <h3>Total: </h3>
                              <span>₱ {formatMoney( preview?.total ?? 0 )}</span>
                           </div>
                        </div>
                        <div className="flex flex-col max-h-[60vh] overflow-auto">
                           {preview?.expensesList.map( ( expense, index ) => (
                              <div key={index} className="flex p-2 justify-between items-center border-1 border-transparent hover:border-slate-700 rounded-lg hover:bg-slate-500 hover:backdrop-filter hover:backdrop-blur-sm hover:bg-opacity-10">
                                 <div className="flex items-center gap-3">
                                    <BillIcon />
                                    <div className="flex flex-col">
                                       <span>{findCategory( expense.categoryID )?.description}</span>
                                       <small className='text-default-500'>{moment( expense.createdOn ).format( 'LT' )} {`${expense.description && `• ${expense.description}`}`}</small>
                                    </div>
                                 </div>
                                 <span className='text-accent-secondary font-semibold'>₱ {formatMoney( expense.amount )}</span>
                              </div>
                           ) )}
                        </div>
                     </ModalBody>
                     <ModalFooter>
                        <Button variant="light" color='danger' onPress={onClose}>
                           Close
                        </Button>
                     </ModalFooter>
                  </>
               )}
            </ModalContent>
         </Modal>
         <Wrapper>
            <WrapperHeader className='flex items-center justify-between'>
               <h3 className='font-semibold text-accent-secondary'>Previous Expenses</h3>
            </WrapperHeader>
            {hasPreviousExpenses ? <>
               <WrapperContent className='flex flex-col'>
                  {context?.previousExpenses.map( expense => (
                     <div key={expense.date} onClick={() => previewExpense( expense )} className="flex p-2 justify-between items-center cursor-pointer border-1 border-transparent hover:border-slate-700 rounded-lg hover:bg-slate-500 hover:backdrop-filter hover:backdrop-blur-sm hover:bg-opacity-10">
                        <div className="flex items-center gap-2">
                           <span>{moment( expense.date ).format( 'll' )}</span>
                        </div>
                        <span className='text-accent-secondary font-semibold'>₱ {formatMoney( expense.total )}</span>
                     </div>
                  ) )}
               </WrapperContent>
               <WrapperFooter className='flex items-center justify-between'>
                  <h3 className='text-default-500'>Total:</h3>
                  <p className='text-default-500'>₱ {formatMoney( totalPreviousExpenses )}</p>
               </WrapperFooter>
            </> : <WrapperContent className='text-center'>
               <Chip color="warning" variant="bordered">No data found!</Chip> </WrapperContent>}

         </Wrapper>
      </>
   )
}

export default PreviousExpenses