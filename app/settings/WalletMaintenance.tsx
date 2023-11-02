'use client'

import React, { useState } from 'react'
import { Wrapper, WrapperContent, WrapperHeader } from '../components/Wrapper'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { PlusIcon } from '../icons/icons'
import moment from 'moment'
import { formatMoney } from '../utils/utils'
import { AppContext } from '../context/context'
import { WalletBudgeType } from '../types/type'
import { toast } from 'react-toastify'
import SuspenseContainer from '../components/SuspenseContainer'

const DEFAULT_FORM = {
   ID: 0,
   title: '',
   description: '',
   amount: '',
}

const WalletMaintenance = () =>
{
   const context = AppContext()
   const { isOpen, onOpen, onOpenChange } = useDisclosure();
   const [formData, setFormData] = useState( DEFAULT_FORM )

   const handleSave = ( onClose: () => void ) =>
   {
      if ( !Object.values( formData ).includes( '' ) && context )
      {
         const { ID, amount, description, title } = formData

         const ACTION_TYPE = ID === DEFAULT_FORM.ID ? 'add' : 'edit'

         const { handleUpdateWalletBudget } = context
         const newBudget: WalletBudgeType = {
            ID,
            title,
            description,
            amount: Number( amount ),
         }
         handleUpdateWalletBudget( newBudget, ACTION_TYPE )

         const alertMessage = ID != DEFAULT_FORM.ID ? 'New expense has been added!' : 'Expense has been updated!'

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

   const handleChangeInput = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) =>
   {
      const { name, value } = e.target;
      setFormData( { ...formData, [name]: value } );
   }

   const handleKeyPress = ( { key }: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent, onClose: () => void ) =>
   {
      if ( key === 'Enter' )
      {
         handleSave( onClose )
      }
   }

   return (
      <>
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
                     <ModalHeader className="flex flex-col gap-1 font-bold">Add New Wallet Budget</ModalHeader>
                     <ModalBody className='flex flex-col gap-2'>
                        <Input
                           value={formData.title}
                           onChange={handleChangeInput}
                           onKeyDown={( event ) => handleKeyPress( event, onClose )}
                           name='title'
                           label="Budget Title"
                           placeholder="Enter budget title"
                           variant="bordered"
                        />
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
         <Wrapper>
            <WrapperHeader className='flex items-center justify-between'>
               <h3 className='font-semibold text-accent-secondary'>Wallet Budget Maintenance</h3>
               <Button isIconOnly color="primary" variant="light" aria-label="Take a photo" size='sm' onClick={onOpen}>
                  <PlusIcon />
               </Button>
            </WrapperHeader>
            <WrapperContent className='flex flex-col' scrollable={true}>
               <SuspenseContainer data={context?.walletBudget}>
                  {context?.walletBudget?.map( ( budget, index ) => (
                     <div key={index} className="flex p-2 justify-between items-center border-1 cursor-pointer border-transparent hover:border-slate-700 rounded-lg hover:bg-slate-500 hover:backdrop-filter hover:backdrop-blur-sm hover:bg-opacity-10">
                        <div className="flex items-center gap-3">
                           {/* <BillIcon /> */}
                           <div className="flex flex-col">
                              <span>{budget.title}</span>
                              <small className='text-default-500 whitespace-nowrap overflow-clip text-ellipsis max-w-xs'>{moment( budget.created_on ).format( 'll' )} {`${budget.description && `• ${budget.description}`}`}</small>
                           </div>
                        </div>
                        <span className='text-accent-secondary font-semibold'> {formatMoney( budget.amount )}</span>
                     </div>
                  ) )}
               </SuspenseContainer>
            </WrapperContent>
         </Wrapper>
      </>
   )
}

export default WalletMaintenance