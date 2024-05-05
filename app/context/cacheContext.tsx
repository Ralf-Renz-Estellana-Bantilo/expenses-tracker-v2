import React, { ReactNode, createContext, useContext, useState } from "react"

type CacheType = {
  [cacheID: string]: any
}

type ResponseCacheType = {
  saveToCache: ({ cacheID, data }: { cacheID: string; data: any }) => void
  getCacheByID: <T>(cachedID: string) => T | null
  removeCacheByID: (cachedID: string) => void
  cacheList: CacheType
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

  const getCacheByID = (cachedID: string) => {
    const hasCachedData = Object.hasOwn(cacheList, cachedID)
    return hasCachedData ? cacheList[cachedID] : null
  }

  const removeCacheByID = (cacheID: string) => {
    const cache = cacheList
    delete cache[cacheID]
    setCache(cache)
  }

  const value: ResponseCacheType = {
    saveToCache,
    getCacheByID,
    removeCacheByID,
    cacheList,
  }

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
}

export const ResponseCacheContext = () => {
  return useContext(CacheContext)
}
