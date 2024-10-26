import React, { ReactNode, createContext, useContext, useState } from "react"

type LoaderType = {
  isLoading: boolean
  setLoading: (args: { status: boolean }) => void
}

export const LoaderContext = createContext<LoaderType>({
  isLoading: !false,
  setLoading: null as any,
})

export default function LoaderContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isLoading, setIsLoading] = useState(!false)

  const setLoading = ({ status }: { status: boolean }) => {
    setIsLoading(status)
  }

  const value: LoaderType = {
    isLoading,
    setLoading,
  }

  return (
    <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
  )
}

export const useLoaderContext = () => {
  return useContext(LoaderContext)
}
