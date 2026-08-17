'use client'

import { CardList } from '@/app/components/CardList'
import SuspenseContainer from '@/app/components/SuspenseContainer'
import {
    Wrapper,
    WrapperContent,
    WrapperFooter,
    WrapperHeader,
} from '@/app/components/Wrapper'
import ExpensesListModal from '@/app/components/modals/ExpensesListModal'
import { ResponseCacheContext } from '@/app/context/cacheContext'
import { useAppContext } from '@/app/context/context'
import { fetchMonthExpenses } from '@/app/controller/controller'
import useAlert from '@/app/hook/useAlert'
import {
    FormattedPreviousExpensesType,
    PreviousExpensesType,
} from '@/app/types/type'
import {
    CURRENT_MONTHID,
    CURRENT_YEAR,
    formatMoney,
    formatPreviousExpenses,
    getCurrentMonth,
} from '@/app/utils/utils'
import { useDisclosure } from '@nextui-org/react'
import moment from 'moment'
import { notFound } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import BreakdownStats from './components/BreakdownStats'
import CategoryBreakdown from './components/CategoryBreakdown'

type PageProps = {
    params: { 'month-year': string }
}

const parseMonthYear = (
    param: string
): { monthID: number; year: number } | null => {
    const parts = param.split('-')
    if (parts.length !== 2) return null

    const monthID = Number(parts[0])
    const year = Number(parts[1])

    if (
        !Number.isInteger(monthID) ||
        !Number.isInteger(year) ||
        monthID < 1 ||
        monthID > 12 ||
        year < 2000 ||
        year > 9999
    ) {
        return null
    }

    return { monthID, year }
}

const MonthlyBreakdownPage = ({ params }: PageProps) => {
    const parsed = parseMonthYear(params['month-year'])
    if (!parsed) notFound()

    const { monthID, year } = parsed!

    const context = useAppContext()
    const cacheContext = ResponseCacheContext()
    const { showAlert } = useAlert()
    const { isMasked, todayExpenses } = context

    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [expensesList, setExpensesList] = useState<
        FormattedPreviousExpensesType[] | null
    >(null)
    const [preview, setPreview] =
        useState<FormattedPreviousExpensesType | null>(null)

    const monthLabel = getCurrentMonth(monthID)
    const monthCode = monthLabel.slice(0, 3).toUpperCase()

    const previewExpense = (expense: FormattedPreviousExpensesType) => {
        if (expense.expensesList.length === 0) {
            showAlert({
                message: 'Preview unavailable',
                type: 'warning',
            })
        } else {
            setPreview(expense)
            onOpen()
        }
    }

    useEffect(() => {
        const loadExpenses = async () => {
            if (!cacheContext) return
            const { useResponse } = cacheContext
            const cacheID = `${monthID}-${year}-mbp`

            try {
                let response =
                    (await useResponse<PreviousExpensesType[]>(cacheID, () =>
                        fetchMonthExpenses({
                            monthID,
                            year,
                            sortBy: 'ID',
                            sortDir: 'ASC',
                        })
                    )) ?? []

                if (
                    CURRENT_MONTHID === monthID &&
                    CURRENT_YEAR === year &&
                    todayExpenses
                ) {
                    const allTodayExpenses: PreviousExpensesType[] =
                        todayExpenses.map((exp) => ({
                            ...exp,
                            year: CURRENT_YEAR,
                            monthID: CURRENT_MONTHID,
                        }))
                    response = [...response, ...allTodayExpenses]
                }

                const result = formatPreviousExpenses({
                    previousExpenses: response,
                    monthID,
                    includesCurrentDay: true,
                    sortOrder: 'DESC',
                    year,
                })
                setExpensesList(result)
            } catch {
                showAlert({
                    type: 'error',
                    message: 'Failed to load expenses',
                })
                setExpensesList([])
            }
        }
        loadExpenses()
    }, [monthID, year, cacheContext?.cacheList, todayExpenses])

    const totalExpenses: number = useMemo(() => {
        return (
            expensesList?.reduce(
                (sum, item) => Number(sum) + Number(item.total),
                0
            ) ?? 0
        )
    }, [expensesList])

    return (
        <>
            <ExpensesListModal
                data={preview}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
            <div className="flex flex-col gap-3">
                <BreakdownStats expensesList={expensesList} />
                <Wrapper>
                    <WrapperHeader className="flex items-center justify-between">
                        <h3 className="font-semibold text-accent-secondary">
                            {monthLabel} {year}
                        </h3>
                        <span className="text-sm text-default-500">
                            {expensesList?.filter(
                                (item) => item.expensesList.length > 0
                            ).length ?? 0}{' '}
                            day(s)
                        </span>
                    </WrapperHeader>
                    <WrapperContent
                        className="flex flex-col"
                        scrollable
                        maxScrollableHeight="70vh"
                    >
                        <SuspenseContainer data={expensesList}>
                            {expensesList?.map((expense) => (
                                <CardList
                                    key={expense.ID}
                                    iconName={monthCode}
                                    title={moment(expense.date).format('ll')}
                                    value={formatMoney(expense.total)}
                                    handleClick={() => previewExpense(expense)}
                                />
                            ))}
                        </SuspenseContainer>
                    </WrapperContent>
                    <WrapperFooter className="flex items-center justify-between">
                        <h3 className="text-default-500">Total:</h3>
                        <p className="text-default-500">
                            {formatMoney(totalExpenses, isMasked)}
                        </p>
                    </WrapperFooter>
                </Wrapper>
                <CategoryBreakdown monthID={monthID} year={year} />
            </div>
        </>
    )
}

export default MonthlyBreakdownPage
