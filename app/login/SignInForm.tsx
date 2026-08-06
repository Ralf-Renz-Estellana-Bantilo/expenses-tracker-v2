'use client'

import { Button } from '@nextui-org/react'
import Image from 'next/image'
import React from 'react'
import { signIn } from 'next-auth/react'

const SignInForm = () => {
    const handleSignIn = () => {
        signIn('google', { callbackUrl: '/dashboard' })
    }

    return (
        <div className="relative flex items-center justify-center w-full h-full px-4">
            <div className="relative flex flex-col gap-8 w-full max-w-sm rounded-2xl p-8 bg-container-primary/70 border border-primary-border-color backdrop-blur-md shadow-2xl">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

                <div className="flex flex-col items-center gap-3">
                    <div className="rounded-2xl bg-container-primary-secondary/60 border border-primary-border-color p-2">
                        <Image
                            src="/logo2.png"
                            alt="Expenses Tracker"
                            width={56}
                            height={56}
                            priority
                        />
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="font-bold text-lg text-accent-primary tracking-wide">
                            Welcome back
                        </h1>
                        <p className="text-sm text-accent-secondary/70">
                            Sign in to your Personal Expenses Tracker
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        color="primary"
                        onClick={handleSignIn}
                        className="font-semibold rounded-lg h-11 bg-container-primary-secondary/80 hover:bg-container-primary-secondary text-accent-primary border border-primary-border-color"
                        variant="flat"
                        startContent={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    fill="#FFC107"
                                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                                />
                            </svg>
                        }
                    >
                        Continue with Google
                    </Button>
                </div>

                <p className="text-xs text-center text-accent-secondary/50">
                    By continuing, you agree to sign in with your Google account.
                </p>
            </div>
        </div>
    )
}

export default SignInForm
