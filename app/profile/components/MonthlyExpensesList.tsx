'use client'

import { CardList } from '@/app/components/CardList'
import YearListDropDown from '@/app/components/Dropdowns/YearListDropDown'
import SuspenseContainer from '@/app/components/SuspenseContainer'
import {
    Wrapper,
    WrapperContent,
    WrapperFooter,
    WrapperHeader,
} from '@/app/components/Wrapper'
import { useAppContext } from '@/app/context/context'
import { MonthlyExpensesType } from '@/app/types/type'
import { CURRENT_YEAR, formatMoney } from '@/app/utils/utils'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

const MonthlyExpensesList = () => {
    const context = useAppContext()
    const {
        monthlyExpenses: monthlyExpensesContext,
        isMasked: isMaskedContext,
    } = context

    const router = useRouter()

    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)

    const monthlyExpenses: MonthlyExpensesType[] | undefined =
        monthlyExpensesContext?.filter(
            (expense) => expense.year === selectedYear
        )

    const totalExpenses: number = useMemo(() => {
        const result =
            monthlyExpenses?.reduce(
                (sum, item) => Number(sum) + Number(item.total),
                0
            ) ?? 0

        return result
    }, [monthlyExpenses])

    const onSelectMonth = useCallback(
        ({ monthID, year }: MonthlyExpensesType) => {
            if (isMaskedContext) return
            router.push(`/expenses/${monthID}-${year}`)
        },
        [isMaskedContext, router]
    )

    return (
        <Wrapper>
            <WrapperHeader className="flex items-center justify-between">
                <h3 className="font-semibold text-accent-secondary">
                    Monthly Expenses
                </h3>
                <YearListDropDown
                    value={selectedYear}
                    onChange={setSelectedYear}
                />
            </WrapperHeader>
            <WrapperContent className="flex flex-col" scrollable>
                <SuspenseContainer data={monthlyExpenses}>
                    {monthlyExpenses?.map((month, index) => (
                        <CardList
                            key={index}
                            iconName={month.monthCode}
                            handleDblClick={() => onSelectMonth(month)}
                            title={month.month}
                            value={formatMoney(month.total, isMaskedContext)}
                        />
                    ))}
                </SuspenseContainer>
            </WrapperContent>
            <WrapperFooter className="flex items-center justify-between">
                <h3 className="text-default-500">Total:</h3>
                <p className="text-default-500">
                    {' '}
                    {formatMoney(totalExpenses, isMaskedContext)}
                </p>
            </WrapperFooter>
        </Wrapper>
    )
}

export default MonthlyExpensesList
