import React, { ReactNode, createContext, useContext, useState } from "react"

type CacheType = {
  [cacheID: string]: any
}

type ResponseCacheType = {
  saveToCache: ({ cacheID, data }: { cacheID: string; data: any }) => void
  getCacheByID: (cachedID: string) => CacheType | null
}

export const CacheContext = createContext<ResponseCacheType | null>(null)

export default function CacheContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [cacheList, setCache] = useState<CacheType>({})

  const saveToCache = ({
    cacheID,
    data,
  }: {
    cacheID: string
    data: any
  }): void => {
    setCache((prev) => ({
      ...prev,
      [cacheID]: data,
    }))
  }

  const getCacheByID = (cachedID: string): CacheType | null => {
    const hasCachedData = Object.hasOwn(cacheList, cachedID)
    return hasCachedData ? cacheList[cachedID] : null
  }

  const value: ResponseCacheType = {
    saveToCache,
    getCacheByID,
  }

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
}

export const ResponseCacheContext = () => {
  return useContext(CacheContext)
}
