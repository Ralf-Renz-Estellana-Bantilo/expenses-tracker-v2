import Header from "../Header"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function ConfigurationsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  if (!session || !session.user) {
    redirect("/login")
  }

  return (
    <section className="flex flex-col h-screen relative">
      <Header title="Configurations" showActions={false} />
      <div className="flex-1 p-3">{children}</div>
    </section>
  )
}
