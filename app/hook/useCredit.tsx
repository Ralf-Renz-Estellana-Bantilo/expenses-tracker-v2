import { useMemo } from 'react'
import { useAppContext } from '../context/context'

const useCredit = () => {
    const context = useAppContext()

    const totalBudget = useMemo(() => {
        const result =
            context.walletBudget?.reduce(
                (sum, item) => Number(sum) + Number(item.amount),
                0
            ) ?? 0

        return result
    }, [context.walletBudget])

    const totalExpenses = useMemo(() => {
        const result =
            context.monthlyExpenses?.reduce(
                (sum, item) => Number(sum) + Number(item.total),
                0
            ) ?? 0

        return result
    }, [context.monthlyExpenses])

    const totalBalance = totalBudget - totalExpenses

    return { totalBudget, totalBalance, totalExpenses }
}

export default useCredit
