"use client"

import React, { ReactNode } from "react"
import { NextUIProvider } from "@nextui-org/react"
import ComponentContextProvider, { AppContext } from "./context/context"
import { ToastContainer } from "react-toastify"
import CacheContextProvider from "./context/cacheContext"

const ContentContainer = ({ children }: { children: ReactNode }) => {
  return (
    <NextUIProvider>
      <ComponentContextProvider>
        <CacheContextProvider>
          <MainSection>
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
          </MainSection>
        </CacheContextProvider>
      </ComponentContextProvider>
    </NextUIProvider>
  )
}

const MainSection = ({ children }: { children: ReactNode }) => {
  const context = AppContext()
  if (!context) return null

  const { selectedColor } = context

  return (
    <main className={`gradient-background-${selectedColor.background} dark `}>
      <section className="flex h-dvh w-dvw flex-col relative overflow-y-auto lg:max-w-[500px] md:max-w-[500px] md:mx-auto lg:mx-auto">
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
      </section>
    </main>
  )
}

export default ContentContainer
