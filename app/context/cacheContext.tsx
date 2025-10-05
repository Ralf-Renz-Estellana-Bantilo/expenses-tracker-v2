import React, { ReactNode, createContext, useContext, useState } from 'react'
import useAlert from '../hook/useAlert'

type CacheType = {
    [cacheID: string]: any
}

type ResponseCacheType = {
    saveToCache: ({ cacheID, data }: { cacheID: string; data: any }) => void
    getCacheByID: <T>(cachedID: string) => T | null
    removeCacheByID: (cachedID: string) => void
    useResponse: <T>(
        key: string,
        callback: () => Promise<void> | void
    ) => Promise<T> | null
    cacheList: CacheType
}

export const CacheContext = createContext<ResponseCacheType | null>(null)

export default function CacheContextProvider({
    children,
}: {
    children: ReactNode
}) {
    const { showAlert } = useAlert()

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

    const useResponse = async (
        key: string,
        callback: () => Promise<void> | void
    ) => {
        const fetchData = async () => {
            return await callback()
        }

        const cacheData = getCacheByID(key)

        if (cacheData) {
            return cacheData
        } else {
            try {
                const response = await fetchData()
                saveToCache({
                    cacheID: key,
                    data: response,
                })
                return response
            } catch (_) {
                showAlert({
                    type: 'error',
                    message: 'Something went wrong with the response!',
                })
                throw new Error('Something went wrong with the response!')
            }
        }
    }

    const value: ResponseCacheType = {
        saveToCache,
        getCacheByID,
        removeCacheByID,
        useResponse,
        cacheList,
    }

    return (
        <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
    )
}

export const ResponseCacheContext = () => {
    return useContext(CacheContext)
}
