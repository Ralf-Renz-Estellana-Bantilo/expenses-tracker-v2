'use client'

import React, { useState } from 'react'
import { Wrapper, WrapperContent, WrapperHeader } from '../components/Wrapper'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { PlusIcon } from '../icons/icons'
import { formatMoney, getExpenseDescription } from '../utils/utils'
import { AppContext } from '../context/context'
import { WalletBudgeType } from '../types/type'
import SuspenseContainer from '../components/SuspenseContainer'
import { CardList, CardListSkeleton } from '../components/CardList'
import useAlert from '../hook/useAlert'

const DEFAULT_FORM = {
   ID: 0,
   title: '',
   description: '',
   amount: '',
   header: 'Add New Wallet Budget',
}

const WalletMaintenance = () =>
{
   const context = AppContext()
   const { isOpen, onOpen, onOpenChange } = useDisclosure();
   const [formData, setFormData] = useState( DEFAULT_FORM )

   const handleSave = ( onClose: () => void ) =>
   {
      const { showAlert } = useAlert()

      if ( !Object.values( formData ).includes( '' ) && Number( formData.amount ) !== 0 && context )
      {
         const { ID, amount, description, title } = formData

         const ACTION_TYPE = ID === DEFAULT_FORM.ID ? 'add' : 'edit'

         const { handleUpdateWalletBudget } = context
         const newBudget: WalletBudgeType = {
            ID,
            title,
            description,
            amount: Number( amount ),
            created_on: `${new Date()}`,
         }

         handleUpdateWalletBudget( newBudget, ACTION_TYPE )

         const alertMessage = ACTION_TYPE === 'add' ? 'New expense has been added!' : 'Expense has been updated!'

         setFormData( DEFAULT_FORM )
         showAlert( { type: 'success', message: alertMessage } )
         onClose()
      } else
      {
         showAlert( { type: 'warning', message: 'Error! Form data is invalid!' } )
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

   const showWalletBudgetDialog = ( walletBudget: WalletBudgeType | null ) =>
   {
      const walletBudgetForm = walletBudget ? {
         header: 'Update Wallet Budget',
         ID: walletBudget.ID,
         title: walletBudget.title,
         description: walletBudget.description,
         amount: `${walletBudget.amount}`,
      } : DEFAULT_FORM

      onOpen()
      setFormData( walletBudgetForm )
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
                     <ModalHeader className="flex flex-col gap-1 font-bold">{formData.header}</ModalHeader>
                     <ModalBody className='flex flex-col gap-2'>
                        <Input
                           value={formData.title}
                           onChange={handleChangeInput}
                           onKeyDown={( event ) => handleKeyPress( event, onClose )}
                           name='title'
                           color='primary'
                           label="Budget Title"
                           isRequired
                           placeholder="Enter budget title"
                           variant="bordered"
                        />
                        <Input
                           value={formData.description}
                           onChange={handleChangeInput}
                           onKeyDown={( event ) => handleKeyPress( event, onClose )}
                           name='description'
                           color='primary'
                           isRequired
                           label="Short description"
                           placeholder="Enter short description"
                           variant="bordered"
                        />
                        <Input
                           value={formData.amount}
                           onChange={handleChangeInput}
                           onKeyDown={( event ) => handleKeyPress( event, onClose )}
                           name='amount'
                           color='primary'
                           label="Amount"
                           isRequired
                           type='number'
                           placeholder="Enter amount"
                           variant="bordered"
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
         <Wrapper>
            <WrapperHeader className='flex items-center justify-between'>
               <h3 className='font-semibold text-accent-secondary'>Wallet Budget Maintenance</h3>
               <Button isIconOnly color="primary" variant="light" aria-label="Take a photo" size='sm' onClick={() => showWalletBudgetDialog( null )}>
                  <PlusIcon />
               </Button>
            </WrapperHeader>
            <WrapperContent className='flex flex-col' scrollable>
               <SuspenseContainer data={context?.walletBudget}>
                  {context?.isWalletBudgetPending.current && <CardListSkeleton />}
                  {context?.walletBudget?.map( ( budget ) => (
                     <CardList
                        key={budget.ID}
                        iconName='peso'
                        title={budget.title}
                        description={getExpenseDescription( budget.created_on, budget.description, 'll' )}
                        value={formatMoney( budget.amount, context.isMasked )}
                        handleDblClick={() => showWalletBudgetDialog( budget )}
                     />
                  ) )}
               </SuspenseContainer>
            </WrapperContent>
         </Wrapper>
      </>
   )
}

export default WalletMaintenance