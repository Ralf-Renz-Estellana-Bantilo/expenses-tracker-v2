import { useState, useEffect } from 'react'

const useDelay = (value: string, delay = 100) => {
    const [deferredValue, setDeferredValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDeferredValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return deferredValue
}

export default useDelay
