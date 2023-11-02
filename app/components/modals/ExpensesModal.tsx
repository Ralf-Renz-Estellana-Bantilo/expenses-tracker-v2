'use client'

import { AppContext } from '@/app/context/context';
import { CATEGORIES_TABLE } from '@/app/database/database';
import { BillIcon } from '@/app/icons/icons';
import { TodaysExpensesType } from '@/app/types/type';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

type ExpensesModalType = {
   isOpen: boolean,
   onOpenChange: () => void,
   data: TodaysExpensesType | null
}

const DEFAULT_FORM = {
   ID: 0,
   categoryID: '1',
   description: '',
   amount: '',
}

const ExpensesModal = ( { isOpen, onOpenChange, data }: ExpensesModalType ) =>
{
   const { data: session } = useSession();
   const context = AppContext()
   const [formData, setFormData] = useState( DEFAULT_FORM )

   const handleChangeInput = useCallback( ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) =>
   {
      const { name, value } = e.target;
      setFormData( { ...formData, [name]: value } );
   }, [formData, isOpen, onOpenChange, data] )

   const handleSave = ( onClose: () => void ) =>
   {
      if ( !Object.values( formData ).includes( '' ) || formData.description === '' )
      {
         if ( context )
         {
            const { ID, amount, categoryID, description } = formData
            const { handleUpdateExpense, todayExpenses } = context

            const categoryList = CATEGORIES_TABLE.find( ( cat ) => cat.ID === Number( formData.categoryID ) )

            const newExpense: TodaysExpensesType = {
               ID,
               category: categoryList?.description,
               categoryID: Number( categoryID ),
               description,
               amount: Number( amount ),
               created_by: session?.user?.email || '',
               created_on: `${new Date()}`,
               status: 1,
            }

            handleUpdateExpense( newExpense, data ? 'edit' : 'add' )

            const alertMessage = !data ? 'New expense has been added!' : 'Expense has been updated!'

            setFormData( DEFAULT_FORM )
            toast.success( alertMessage, {
               position: "bottom-right",
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "dark",
            } );

            onClose()
         }
      } else
      {
         toast.error( 'Error saving new expense!', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
         } );
      }
   }

   const handleKeyPress = ( { key }: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent, onClose: () => void ) =>
   {
      if ( key === 'Enter' )
      {
         handleSave( onClose )
      }
   }

   useEffect( () =>
   {
      if ( data )
      {
         const { ID, amount, categoryID, description } = data
         setFormData( {
            ID,
            amount: amount.toString(),
            categoryID: categoryID.toString(),
            description: description ?? ''
         } )
      } else
      {
         setFormData( {
            ...formData,
            ID: Math.floor( Math.random() * 1000 ),
         } )
      }

      return () =>
      {
         setFormData( DEFAULT_FORM )
      }
   }, [isOpen, onOpenChange, data] )

   return (
      <Modal
         className='border-1 border-border-color bg-container-primary'
         backdrop='blur'
         isOpen={isOpen}
         onOpenChange={onOpenChange}
         placement="bottom-center"
      >
         <ModalContent>
            {( onClose ) => (
               <>
                  <ModalHeader className="flex flex-col gap-1 font-bold">Add New Expense</ModalHeader>
                  <ModalBody>
                     {context?.categories && <Select
                        label="Select category"
                        variant='bordered'
                        selectedKeys={[formData.categoryID]}
                        onChange={handleChangeInput}
                        name='categoryID'
                     >
                        {context?.categories.map( ( category ) => (
                           <SelectItem startContent={<BillIcon />} key={category.ID} value={category.ID}>
                              {category.description}
                           </SelectItem>
                        ) )}
                     </Select>}
                     <Input
                        value={formData.description}
                        onChange={handleChangeInput}
                        onKeyDown={( event ) => handleKeyPress( event, onClose )}
                        name='description'
                        label="Short description"
                        placeholder="Enter short description"
                        variant="bordered"
                     />
                     <Input
                        value={formData.amount}
                        onChange={handleChangeInput}
                        onKeyDown={( event ) => handleKeyPress( event, onClose )}
                        name='amount'
                        label="Amount"
                        type='number'
                        placeholder="Enter amount"
                        variant="bordered"
                     />
                  </ModalBody>
                  <ModalFooter>
                     <Button variant="light" color='danger' onPress={onClose}>
                        Close
                     </Button>
                     <Button color="primary" onPress={() => handleSave( onClose )}>
                        Save
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   )
}

export default memo( ExpensesModal )