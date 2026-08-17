import Header from '../Header'

export default async function ExpensesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex flex-col h-dvh relative">
            <Header title="Expenses Breakdown" showActions={false} />
            <div className="flex-1 p-3">{children}</div>
        </section>
    )
}
