'use client'

import MonthListDropDown from '@/app/components/Dropdowns/MonthListDropDown'
import { useDisclosure } from '@nextui-org/react'
import moment from 'moment'
import { useState } from 'react'
import { CardList } from '../../components/CardList'
import SuspenseContainer from '../../components/SuspenseContainer'
import {
    Wrapper,
    WrapperContent,
    WrapperFooter,
    WrapperHeader,
} from '../../components/Wrapper'
import ExpensesListModal from '../../components/modals/ExpensesListModal'
import { AppContext } from '../../context/context'
import useAlert from '../../hook/useAlert'
import { FormattedPreviousExpensesType } from '../../types/type'
import {
    CURRENT_MONTHID,
    formatMoney,
    getCurrentMonth,
} from '../../utils/utils'

export interface TMonthList {
    monthID: number
    month: string
}

const CURRENT_MONTH: TMonthList = {
    month: getCurrentMonth(),
    monthID: CURRENT_MONTHID,
}

const PreviousExpenses = () => {
    const context = AppContext()
    const { showAlert } = useAlert()

    const { getPreviousExpenses, previousExpenses, isMasked } = context

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const [selectedMonth, setSelectedMonth] =
        useState<TMonthList>(CURRENT_MONTH)

    const [preview, setPreview] =
        useState<FormattedPreviousExpensesType | null>(null)

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

    const onSelectMonth = async (item: TMonthList) => {
        setSelectedMonth(item)
        await getPreviousExpenses(item.monthID)
    }

    const totalPreviousExpenses: number =
        previousExpenses?.reduce(
            (accumulator, item) => Number(accumulator) + Number(item.total),
            0
        ) ?? 0

    const monthCode = getCurrentMonth().slice(0, 3).toUpperCase()

    return (
        <>
            <ExpensesListModal
                data={preview}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
            <Wrapper>
                <WrapperHeader className="flex items-center justify-between">
                    <h3 className="font-semibold text-accent-secondary">
                        Previous Expenses
                    </h3>
                    <MonthListDropDown
                        value={selectedMonth}
                        onChange={onSelectMonth}
                    />
                </WrapperHeader>
                <WrapperContent className="flex flex-col" scrollable>
                    <SuspenseContainer data={previousExpenses}>
                        {previousExpenses?.map((expense) => (
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
                        {' '}
                        {formatMoney(totalPreviousExpenses, isMasked)}
                    </p>
                </WrapperFooter>
            </Wrapper>
        </>
    )
}

export default PreviousExpenses
