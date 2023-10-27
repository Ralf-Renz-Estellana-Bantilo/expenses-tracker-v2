'use client'

import React from 'react'
import { Wrapper, WrapperContent, WrapperHeader } from '../components/Wrapper'
import { BellIcon, BillIcon, DeleteIcon, EditIcon, PlusIcon } from '../icons/icons'
import { Button } from '@nextui-org/react'
import { CATEGORIES_TABLE } from '../database/database'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

const SettingsPage = () =>
{
   const { data: session } = useSession();

   if ( !session )
   {
      redirect( '/' )
   }

   return (
      <div className='flex flex-col gap-3'>
         <Wrapper>
            <WrapperHeader className='flex items-center justify-between'>
               <h3 className='font-semibold text-accent-secondary'>Category Maintenance</h3>
               <Button isIconOnly color="primary" variant="light" aria-label="Take a photo" size='sm'>
                  <PlusIcon />
               </Button>
            </WrapperHeader>
            <WrapperContent className='flex flex-col'>
               {CATEGORIES_TABLE.map( category => (
                  <div className="flex p-2 justify-between items-center border-1 border-transparent hover:border-slate-700 rounded-lg hover:bg-slate-500 hover:backdrop-filter hover:backdrop-blur-sm hover:bg-opacity-10" key={category.ID}>
                     <div className="flex items-center gap-2">
                        <BillIcon />
                        <span>{category.description}</span>
                     </div>
                     <div className="flex items-center gap-1">
                        <Button isIconOnly color="warning" variant="light" aria-label="Edit Category" size='sm'>
                           <EditIcon />
                        </Button>
                        <Button isIconOnly color="danger" variant="light" aria-label="Remove Category" size='sm'>
                           <DeleteIcon />
                        </Button>
                     </div>
                  </div>
               ) )}
            </WrapperContent>
         </Wrapper>
      </div>
   )
}

export default SettingsPage