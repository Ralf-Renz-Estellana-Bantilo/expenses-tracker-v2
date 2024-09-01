import Header from "../Header"

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col h-screen relative">
      <Header title="Search" showActions={false} />
      <div className="flex-1 p-3">{children}</div>
    </section>
  )
}
