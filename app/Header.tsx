'use client'

import React from 'react'
import { Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { BellIcon, FilterIcon } from './icons/icons';
import { AppContext } from './context/context';
import { redirect } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react'


const Header = () =>
{
   const context = AppContext()
   const { data: session } = useSession();

   const handleSignOut = () =>
   {
      signOut()
      redirect( '/login' )
   }

   if ( !session )
   {
      redirect( '/login' )
   }

   return (
      <div className="z-20 flex items-center justify-between p-2 sticky top-0 border-b-1 border-border-color bg-container-primary">
         <h3 className='font-bold text-accent-primary text-lg'>{`< ${context?.activeTab.description} />`}</h3>

         <div className="flex gap-2">
            <Button isIconOnly color="default" variant="light" aria-label="Take a photo">
               <FilterIcon />
            </Button>
            <Button isIconOnly color="default" variant="light" aria-label="Take a photo">
               <BellIcon />
            </Button>
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
                  <DropdownItem key="profile" className="h-14 gap-2">
                     <p className="font-semibold">Signed in as</p>
                     <p className="font-semibold">{session.user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="settings">
                     My Settings
                  </DropdownItem>
                  <DropdownItem key="team_settings">Team Settings</DropdownItem>
                  <DropdownItem key="analytics">
                     Analytics
                  </DropdownItem>
                  <DropdownItem key="system">System</DropdownItem>
                  <DropdownItem key="configurations">Configurations</DropdownItem>
                  <DropdownItem key="help_and_feedback">
                     Help & Feedback
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