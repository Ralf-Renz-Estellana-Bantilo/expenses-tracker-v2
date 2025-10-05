'use client'

import { CardList } from '@/app/components/CardList'
import SuspenseContainer from '@/app/components/SuspenseContainer'
import { AppContext } from '@/app/context/context'
import { FormattedPreviousExpensesType } from '@/app/types/type'
import {
    CURRENT_MONTHID,
    formatMoney,
    getCurrentMonth,
} from '@/app/utils/utils'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/react'
import moment from 'moment'
import React, { useMemo } from 'react'

type ModalProps = {
    expensesList: FormattedPreviousExpensesType[] | null
    isOpen: boolean
    onOpenChange: () => void
}

const MonthlyExpensesModal = ({
    expensesList,
    isOpen,
    onOpenChange,
}: ModalProps) => {
    const context = AppContext()
    const { selectedColor, isMasked } = context

    const totalPreviousExpenses: number = useMemo(() => {
        return (
            expensesList?.reduce(
                (accumulator, item) => Number(accumulator) + Number(item.total),
                0
            ) ?? 0
        )
    }, [expensesList])

    const MONTHID = expensesList ? expensesList[0].monthID : CURRENT_MONTHID
    const monthCode = getCurrentMonth(MONTHID).slice(0, 3).toUpperCase()

    return (
        <Modal
            // className={`border-1 border-${selectedColor.background}-border-color bg-container-${selectedColor.background}-secondary`}
            style={{
                backgroundColor: selectedColor.properties.secondaryAccent,
                border: `1px solid ${selectedColor.properties.borderColor}`,
            }}
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            scrollBehavior="inside"
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 font-bold">
                            Expenses List
                        </ModalHeader>
                        <ModalBody className="flex flex-col gap-0">
                            <SuspenseContainer data={expensesList}>
                                {expensesList?.map((expense) => (
                                    <CardList
                                        key={expense.ID}
                                        iconName={monthCode}
                                        title={moment(expense.date).format(
                                            'll'
                                        )}
                                        value={formatMoney(expense.total)}
                                    />
                                ))}
                            </SuspenseContainer>
                        </ModalBody>
                        <ModalFooter className="w-full">
                            <div className="flex items-center border-1 border-red-800 bg-red-500 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg p-2 justify-between text-default-500 flex-1">
                                <h3>Total: </h3>
                                <span className="font-semibold text-accent-primary">
                                    {formatMoney(
                                        totalPreviousExpenses,
                                        isMasked ?? false
                                    )}
                                </span>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default MonthlyExpensesModal
