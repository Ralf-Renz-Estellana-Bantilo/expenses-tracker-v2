'use client'

import React, { ReactNode } from 'react'
import { NextUIProvider } from '@nextui-org/react'
import NavFooter from './NavFooter';
import ComponentContextProvider from './context/context';
import Header from './Header';
import { useSession } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'

const ContentContainer = ( { children }: { children: ReactNode } ) =>
{
   const { data: session } = useSession();


   return (
      <NextUIProvider>
         <ComponentContextProvider>
            <main className="dark flex h-screen flex-col relative overflow-y-auto lg:max-w-[500px] md:max-w-[500px] md:mx-auto lg:mx-auto">
               {/* header */}
               {session && <Header />}

               {/* main content */}
               <div className="flex-1 p-3">
                  {children}
               </div>

               {/* navigation footer */}
               {session && <NavFooter />}

               <ToastContainer
                  position="bottom-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
               />
            </main>
         </ComponentContextProvider>
      </NextUIProvider>
   )
}

export default ContentContainer