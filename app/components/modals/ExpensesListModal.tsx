'use client'

import { formatMoney, getExpenseDescription } from '@/app/utils/utils'
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/react'
import moment from 'moment'
import React, { memo } from 'react'
import { CardList } from '../CardList'
import {
    ExpensesModalType,
    FormattedPreviousExpensesType,
} from '@/app/types/type'
import { AppContext } from '@/app/context/context'

const ExpensesListModal = ({
    data,
    isOpen,
    onOpenChange,
}: ExpensesModalType<FormattedPreviousExpensesType>) => {
    const context = AppContext()
    const { categories, selectedColor } = context

    const findCategory = (categoryID: number) => {
        return categories?.find(({ ID }) => ID === categoryID)
    }

    return (
        <Modal
            style={{
                backgroundColor: selectedColor.properties.secondaryAccent,
                border: `1px solid ${selectedColor.properties.borderColor}`,
            }}
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 font-bold">
                            Expenses List
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border-1 border-blue-800 bg-blue-500 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg p-2 justify-between text-default-500 flex-1 ">
                                    <h3>Date: </h3>
                                    <span className="font-semibold text-accent-primary">
                                        {moment(data?.date).format('ll')}
                                    </span>
                                </div>
                                <div className="flex items-center border-1 border-red-800 bg-red-500 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg p-2 justify-between text-default-500 flex-1">
                                    <h3>Total: </h3>
                                    <span className="font-semibold text-accent-primary">
                                        {formatMoney(data?.total ?? 0)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col max-h-[48vh] overflow-auto">
                                {data?.expensesList.map((expense) => (
                                    <CardList
                                        key={expense.ID}
                                        iconName={expense.imgPath}
                                        title={
                                            findCategory(expense.categoryID)
                                                ?.description
                                        }
                                        description={getExpenseDescription(
                                            expense.created_on,
                                            expense.description
                                        )}
                                        value={formatMoney(expense.amount)}
                                    />
                                ))}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="light"
                                color="danger"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default memo(ExpensesListModal)
