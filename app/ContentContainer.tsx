'use client'

import React, { ReactNode } from 'react'
import { NextUIProvider } from '@nextui-org/react'
import ComponentContextProvider from './context/context';
import { ToastContainer } from 'react-toastify'

const ContentContainer = ( { children }: { children: ReactNode } ) =>
{

   return (
      <NextUIProvider>
         <ComponentContextProvider>
            <main className="dark flex h-screen flex-col relative overflow-y-auto lg:max-w-[500px] md:max-w-[500px] md:mx-auto lg:mx-auto">
               {children}
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