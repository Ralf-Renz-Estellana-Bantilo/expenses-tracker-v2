import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import ContentContainer from "./ContentContainer"
import { getServerSession } from "next-auth"
import SessionProvider from "./components/SessionProvider"
import axios from "axios"

const quicksand = Quicksand({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expenses Tracker App",
  description: "Generated by create next app",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={`gradient-background dark ${quicksand.className}`}>
        <SessionProvider session={session}>
          <ContentContainer>{children}</ContentContainer>
        </SessionProvider>
      </body>
    </html>
  )
}
