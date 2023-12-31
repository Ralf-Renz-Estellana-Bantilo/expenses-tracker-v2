import React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import SignInForm from "./SignInForm"

const LoginPage = async () => {
  const session = await getServerSession()
  if (session) {
    redirect("/dashboard")
  }

  return <SignInForm />
}

export default LoginPage
