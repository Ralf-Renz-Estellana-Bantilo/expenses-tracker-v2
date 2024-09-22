"use client"

import { Button, Divider, Input } from "@nextui-org/react"
import React, { useMemo, useState } from "react"
import { signIn } from "next-auth/react"
import {
  EmailIcon,
  EyeFilledIcon,
  EyeSlashFilledIcon,
  LockIcon,
} from "../icons/icons"

const SignInForm = () => {
  const [value, setValue] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const isInvalid = useMemo(() => {
    if (value === "") return false

    return validateEmail(value) ? false : true
  }, [value])

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "http://localhost:3000/dashboard" })
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col gap-4 min-w-[300px] border-1 border-slate-600 rounded-lg p-3 bg-blue-300 backdrop-filter backdrop-blur-sm bg-opacity-10">
        <div className="flex flex-col justify-center items-center w-full">
          {/* <div className="flex">
                  <Image src={LoginLogo} height={120} alt='Expenses Tracker Illustration' />
               </div> */}
          <h2 className="font-bold text-accent-primary">
            PERSONAL EXPENSES TRACKER
          </h2>
        </div>
        <div className="flex flex-col justify-center">
          <Button
            color="primary"
            onClick={handleSignIn}
            className="font-semibold rounded-lg"
            variant="ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="48"
              height="48"
              viewBox="0 0 64 64"
              fill="currentColor"
            >
              <path d="M30.997,28.126l20.738,0.029C53.545,36.731,50.236,54,30.997,54C18.844,54,8.992,44.15,8.992,32s9.852-22,22.005-22	c5.708,0,10.907,2.173,14.817,5.736l-6.192,6.19c-2.321-1.988-5.329-3.196-8.625-3.196c-7.33,0-13.273,5.941-13.273,13.27	s5.942,13.27,13.273,13.27c6.156,0,10.412-3.644,11.978-8.738H30.997V28.126z"></path>
            </svg>
            Sign-in
          </Button>
          <div className="flex items-center">
            <Divider className="flex-1" />
            <small className="p-2 text-default-400">or</small>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-3">
            <Input
              value={value}
              type="email"
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              isInvalid={isInvalid}
              color={isInvalid ? "danger" : "primary"}
              onValueChange={setValue}
              className="max-w-xs"
              startContent={<EmailIcon />}
            />
            <Input
              label="Password"
              variant="bordered"
              placeholder="Enter your password"
              color="primary"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              startContent={<LockIcon />}
              type={isVisible ? "text" : "password"}
              className="max-w-xs"
            />
            <Button
              color="primary"
              onClick={handleSignIn}
              className="font-semibold rounded-lg"
              variant="solid"
            >
              Log-in
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInForm
