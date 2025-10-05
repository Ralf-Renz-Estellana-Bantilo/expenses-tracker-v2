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
import { ResponseCacheContext } from '@/app/context/cacheContext'
import { AppContext } from '@/app/context/context'
import { fetchMasterSelect } from '@/app/controller/controller'
import {
    FormattedPreviousExpensesType,
    MasterSelectPayloadType,
    MonthlyExpensesType,
    PreviousExpensesType,
} from '@/app/types/type'
import {
    CURRENT_MONTHID,
    CURRENT_YEAR,
    formatMoney,
    formatPreviousExpenses,
} from '@/app/utils/utils'
import { useDisclosure } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useCallback, useMemo, useState } from 'react'
import MonthlyExpensesModal from './MonthlyExpensesModal'

const MonthlyExpensesList = () => {
    const context = AppContext()
    const {
        todayExpenses,
        monthlyExpenses: monthlyExpensesContext,
        isMasked: isMaskedContext,
    } = context

    const cacheContext = ResponseCacheContext()
    const { data: session } = useSession()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
    const [expensesList, setExpensesList] = useState<
        FormattedPreviousExpensesType[] | null
    >(null)

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
        async ({ monthID, year }: MonthlyExpensesType) => {
            const isMasked = isMaskedContext ?? false
            if (!isMasked) {
                if (cacheContext) {
                    const { useResponse } = cacheContext

                    const cachedID = `${monthID}-${year}-mel`

                    const payload: MasterSelectPayloadType<PreviousExpensesType> =
                        {
                            table: 'previous_expenses_view',
                            filter: {
                                monthID,
                                year,
                                created_by: session?.user?.email ?? '',
                                status: 1,
                            },
                            sort: {
                                ID: 'ASC',
                            },
                        }
                    let response = await useResponse<PreviousExpensesType[]>(
                        cachedID,
                        () => fetchMasterSelect(payload)
                    )

                    if (response) {
                        if (
                            CURRENT_MONTHID === monthID &&
                            year === CURRENT_YEAR
                        ) {
                            if (todayExpenses) {
                                const allTodayExpenses: PreviousExpensesType[] =
                                    Array.from(todayExpenses, (exp) => {
                                        const result: PreviousExpensesType = {
                                            ...exp,
                                            year: CURRENT_YEAR,
                                            monthID: CURRENT_MONTHID,
                                        }
                                        return result
                                    })
                                response = [...response, ...allTodayExpenses]
                            }
                        }
                    } else {
                        response = []
                    }
                    const result = formatPreviousExpenses({
                        previousExpenses: response,
                        monthID,
                        includesCurrentDay: true,
                        year,
                    })

                    setExpensesList(result)
                    onOpen()
                }
            }
        },
        [setExpensesList, isMaskedContext, cacheContext?.cacheList]
    )

    return (
        <>
            <MonthlyExpensesModal
                expensesList={expensesList}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
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
                                value={formatMoney(
                                    month.total,
                                    isMaskedContext
                                )}
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
        </>
    )
}

export default MonthlyExpensesList
