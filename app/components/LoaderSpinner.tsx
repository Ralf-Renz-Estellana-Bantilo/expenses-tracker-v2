'use client'

import React from 'react'
import { Spinner } from '@nextui-org/react'
import { Wrapper } from './Wrapper'
import { useLoaderContext } from '../context/loaderContext'

const LoaderSpinner = () => {
    const { isLoading } = useLoaderContext()

    if (!isLoading) return null

    return (
        <div className="fixed inset-0 h-dvh w-dvw z-50 flex justify-center items-center select-none bg-black/30 backdrop-blur-sm">
            <Wrapper className="shadow-2xl shadow-black/50">
                <Spinner color="primary" size="lg" />
            </Wrapper>
        </div>
    )
}

export default LoaderSpinner
