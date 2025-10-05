'use client'

import { AppContext } from '@/app/context/context'
import { fetchSearch } from '@/app/controller/controller'
import useAlert from '@/app/hook/useAlert'
import { WarningIcon } from '@/app/icons/icons'
import { ExpensesType, TodaysExpensesType } from '@/app/types/type'
import { formatMoney, getExpenseDescription } from '@/app/utils/utils'
import { Chip, useDisclosure } from '@nextui-org/react'
import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import { CardList } from '../CardList'
import ExpensesFormModal from './ExpensesFormModal'

const SearchResults = ({
    query,
    setResult,
}: {
    query: string
    setResult: Dispatch<React.SetStateAction<ExpensesType[]>>
}) => {
    const context = AppContext()
    const [data, setData] = useState<ExpensesType[]>([])
    const { showAlert } = useAlert()

    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [preview, setPreview] = useState<TodaysExpensesType | null>(null)

    const fetchData = async () => {
        if (query.length !== 0) {
            try {
                const result = await fetchSearch<ExpensesType[]>({
                    searchText: query,
                })

                setData(result)
                setResult(result)
            } catch (error) {
                showAlert({
                    message: 'Error fetching data...',
                    type: 'error',
                })
                setData([])
            }
        } else {
            setData([])
            setResult([])
        }
    }

    const showExpenseDialog = useCallback(
        (expense: TodaysExpensesType | null) => {
            onOpen()
            setPreview(expense)
        },
        [onOpen, context]
    )

    const onHideExpense = (expense: TodaysExpensesType) => {
        const updatedData = data.filter((item) => item.ID !== expense.ID)

        setData(updatedData)
        setResult(updatedData)

        showAlert({
            type: 'success',
            message: 'Data has been hidden.',
        })
    }

    const findCategory = (categoryID: number) => {
        return context.categories?.find(({ ID }) => ID === categoryID)
    }

    useEffect(() => {
        fetchData()
    }, [query])

    return (
        <>
            {preview && (
                <ExpensesFormModal
                    key={preview.ID}
                    isOpen={isOpen}
                    data={preview}
                    canHide
                    onOpenChange={onOpenChange}
                    afterHandler={fetchData}
                    onHide={onHideExpense}
                />
            )}

            <div className="flex flex-col">
                {data?.map((expense) => (
                    <CardList
                        key={expense.ID}
                        iconName={expense.imgPath}
                        title={findCategory(expense.categoryID)?.description}
                        description={getExpenseDescription(
                            expense.created_on,
                            expense.description,
                            'll'
                        )}
                        value={formatMoney(expense.amount)}
                        handleDblClick={() => {
                            const newExpense: TodaysExpensesType = {
                                ...expense,
                                category: findCategory(expense.categoryID)
                                    ?.description,
                            }
                            showExpenseDialog(newExpense)
                        }}
                    />
                ))}

                {query && data.length === 0 && (
                    <div className="text-center pt-1">
                        <Chip
                            startContent={<WarningIcon className="w-4 h-4" />}
                            variant="light"
                            color="warning"
                        >
                            No data found!
                        </Chip>
                    </div>
                )}
            </div>
        </>
    )
}

export default SearchResults
