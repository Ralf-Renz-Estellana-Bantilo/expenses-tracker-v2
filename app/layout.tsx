import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import ContentContainer from './ContentContainer'
import { getServerSession } from 'next-auth'
import SessionProvider from './components/SessionProvider'

const quicksand = Quicksand({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Expenses Tracker App',
    description: 'Personal Expenses Tracker Application',
    manifest: '/manifest.json',
    icons: {
        icon: [
            {
                url: '../public/logo2.png',
                href: '../public/logo2.png',
            },
        ],
    },
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession()

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link
                    rel="icon"
                    href="/icon?<generated>"
                    type="image/<generated>"
                    sizes="<generated>"
                />
            </head>
            <body className={`gradient-background dark ${quicksand.className}`}>
                <SessionProvider session={session}>
                    <ContentContainer>{children}</ContentContainer>
                </SessionProvider>
            </body>
        </html>
    )
}
