"use client"

import React from "react"
import { Spinner } from "@nextui-org/react"
import { Wrapper } from "./Wrapper"
import { AppContext } from "../context/context"
import { redirect } from "next/navigation"

const LoaderSpinner = () => {
  const context = AppContext()

  if (!context) redirect("/login")

  const { isLoadingState } = context

  if (!isLoadingState.current) return null

  return (
    <div className="fixed h-dvh w-dvw z-50 flex justify-center items-center bg-slate-500 backdrop-filter backdrop-blur-sm bg-opacity-10">
      <Wrapper className="absolute top=[50%]">
        <Spinner
          label="Loading..."
          color="primary"
          size="lg"
          labelColor="foreground"
        />
      </Wrapper>
    </div>
  )
}

export default LoaderSpinner
