'use client'

import { AppContext } from '@/app/context/context';
import { TodaysExpensesType } from '@/app/types/type';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import useAlert from '@/app/hook/useAlert';

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
   header: 'Add New Expense',
}

const ExpensesModal = ( { isOpen, onOpenChange, data }: ExpensesModalType ) =>
{
   const { data: session } = useSession();
   const context = AppContext()
   const [formData, setFormData] = useState( DEFAULT_FORM )

   const handleChangeInput = useCallback( ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ): void =>
   {
      const { name, value } = e.target;
      setFormData( { ...formData, [name]: value } );
   }, [formData, isOpen, onOpenChange, data] )

   const handleSave = ( onClose: () => void ): void =>
   {
      const { showAlert } = useAlert()
      const { ID, amount, categoryID, description } = formData

      if ( categoryID !== '' && Number( amount ) !== 0 && amount !== '' )
      {
         if ( context )
         {
            const { handleUpdateExpense, categories } = context

            const ACTION_TYPE = ID === DEFAULT_FORM.ID ? 'add' : 'edit'

            const categoryList = categories?.find( ( cat ) => cat.ID === Number( formData.categoryID ) )

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

            handleUpdateExpense( newExpense, ACTION_TYPE )

            const alertMessage = ACTION_TYPE === 'add' ? 'New expense has been added!' : 'Expense has been updated!'

            setFormData( DEFAULT_FORM )
            showAlert( { type: 'success', message: alertMessage } )
            onClose()
         }
      } else
      {
         showAlert( { type: 'warning', message: 'Error! Form data is invalid!' } )
      }
   }

   const handleKeyPress = ( { key }: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent, onClose: () => void ): void =>
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
            description: description ?? '',
            header: 'Update Expense'
         } )
      } else
      {
         setFormData( DEFAULT_FORM )
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
                  <ModalHeader className="flex flex-col gap-1 font-bold">{formData.header}</ModalHeader>
                  <ModalBody>
                     {context?.categories && <Select
                        label="Select category"
                        variant='bordered'
                        color='primary'
                        isRequired
                        selectedKeys={[formData.categoryID]}
                        onChange={handleChangeInput}
                        name='categoryID'
                     >
                        {context?.categories.map( ( category ) => (
                           <SelectItem color='primary' startContent={<Image src={require( `@/public/assets/icons/${category.imgPath}.png` ).default} alt='icon' height={27} />} key={category.ID} value={category.ID}>
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
                        color='primary'
                     />
                     <Input
                        value={formData.amount}
                        onChange={handleChangeInput}
                        onKeyDown={( event ) => handleKeyPress( event, onClose )}
                        name='amount'
                        isRequired
                        label="Amount"
                        type='number'
                        placeholder="Enter amount"
                        variant="bordered"
                        color='primary'
                        startContent={
                           <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">₱</span>
                           </div>
                        }
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