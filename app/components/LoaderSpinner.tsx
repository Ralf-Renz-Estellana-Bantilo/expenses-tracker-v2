"use client"

import React from "react"
import { Spinner } from "@nextui-org/react"
import { Wrapper } from "./Wrapper"
import { useLoaderContext } from "../context/loaderContext"

const LoaderSpinner = () => {
  const { isLoading } = useLoaderContext()

  if (!isLoading) return null

  return (
    <div className="fixed h-dvh w-dvw z-50 flex justify-center items-center select-none">
      <Wrapper className="absolute top=[50%]">
        <Spinner color="primary" size="lg" />
      </Wrapper>
    </div>
  )
}

export default LoaderSpinner
