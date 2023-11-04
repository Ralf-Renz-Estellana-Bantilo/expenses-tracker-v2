'use client'

import React from 'react'
import { AppContext } from '../context/context'
import { Wrapper, WrapperContent, WrapperHeader } from '../components/Wrapper'
import { Button } from '@nextui-org/react'
import { BillIcon, DeleteIcon, EditIcon, PlusIcon } from '../icons/icons'
import SuspenseContainer from '../components/SuspenseContainer'
import Image from 'next/image'
import CardList from '../components/CardList'

const CategoryMaintenance = () =>
{
   const context = AppContext()

   return (
      <Wrapper>
         <WrapperHeader className='flex items-center justify-between'>
            <h3 className='font-semibold text-accent-secondary'>Category Maintenance</h3>
            {/* <Button isIconOnly color="primary" variant="light" aria-label="Take a photo" size='sm'>
               <PlusIcon />
            </Button> */}
         </WrapperHeader>
         <WrapperContent className='flex flex-col' scrollable>
            <SuspenseContainer data={context?.categories} noDataMsg='No categories found!'>
               {context?.categories?.map( category => (
                  <CardList
                     key={category.ID}
                     iconName={category.imgPath}
                     title={category.description}
                  />
               ) )}
            </SuspenseContainer>
         </WrapperContent>
      </Wrapper>
   )
}

export default CategoryMaintenance