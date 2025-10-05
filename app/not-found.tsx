'use client'

import { Button } from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import { useRouter, redirect } from 'next/navigation'

export default function Custom404() {
    const router = useRouter()
    const navigateBack = () => {
        router.back()
    }

    const navigateHome = () => {
        signOut()
        redirect('/login')
    }

    return (
        <div className="h-dvh flex justify-center items-center">
            <div className="flex justify-center items-center flex-col gap-4">
                <div className="flex flex-col">
                    <h1 className="text-accent-primary text-3xl font-bold">
                        404 Error
                    </h1>
                    <span className="text-accent-secondary text-medium">
                        Page not found!
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="bordered"
                        color="primary"
                        onClick={navigateBack}
                    >
                        Go Back
                    </Button>
                    <Button color="primary" onClick={navigateHome}>
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
