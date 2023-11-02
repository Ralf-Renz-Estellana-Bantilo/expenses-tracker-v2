'use client'

import React, { useEffect } from 'react'
import { Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { BackIcon, BellIcon, FilterIcon } from './icons/icons';
import { AppContext } from './context/context';
import { redirect, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react'
import axios from 'axios'
import { MasterSelectPayloadType } from './types/type';


const Header = ( { title, showActions }: { title?: string, showActions?: boolean } ) =>
{
   const context = AppContext()
   const { data: session } = useSession();
   const router = useRouter()

   const handleSignOut = () =>
   {
      signOut()
      redirect( '/login' )
   }

   const handleChangeRoute = ( path: string ) =>
   {
      router.push( path )
   }

   const toggleMask = () =>
   {
      if ( context )
      {
         const { setIsMasked } = context

         setIsMasked( prevState => !prevState )
      }
   }

   if ( !session )
   {
      redirect( '/login' )
   }

   return (
      <div className="z-20 flex items-center justify-between p-2 sticky top-0 border-b-1 border-border-color bg-container-primary">
         <div className="flex items-center gap-2">
            {title && <Button isIconOnly color="default" variant="light" aria-label="Take a photo" onClick={() => handleChangeRoute( '/dashboard' )}>
               <BackIcon />
            </Button>}

            <h3 className='font-bold text-accent-primary text-lg'>
               {title ? title : context?.activeTab.description}
            </h3>
         </div>

         <div className="flex gap-2">
            {showActions || showActions === undefined && <>
               <Button isIconOnly color="default" variant="light" aria-label="Take a photo">
                  <FilterIcon />
               </Button>
               <Button isIconOnly color="default" variant="light" aria-label="Take a photo">
                  <BellIcon />
               </Button>
            </>}
            <Dropdown className='dark bg-container-primary border-1 border-border-color' placement="bottom-end">
               <DropdownTrigger>
                  <Avatar
                     isBordered
                     as="button"
                     className="transition-transform"
                     src={session.user?.image ?? "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                  />
               </DropdownTrigger>
               <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2" onClick={() => handleChangeRoute( '/profile' )}>
                     <p className="font-semibold">Signed in as</p>
                     <p className="font-semibold">{session.user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="analytics" onClick={() => handleChangeRoute( '/analytics' )}>
                     Analytics
                  </DropdownItem>
                  <DropdownItem key="configurations" onClick={() => handleChangeRoute( '/configurations' )}>Configurations</DropdownItem>
                  <DropdownItem key="settings" onClick={() => handleChangeRoute( '/settings' )}>
                     Settings
                  </DropdownItem>
                  <DropdownItem key="settings" onClick={toggleMask}>
                     {context?.isMasked ? 'Disable Mask' : 'Enable Mask'}
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
                     Log Out
                  </DropdownItem>
               </DropdownMenu>
            </Dropdown>
         </div>
      </div>
   )
}

export default Header