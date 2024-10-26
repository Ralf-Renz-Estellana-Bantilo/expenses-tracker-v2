"use client"

import { fetchSearch } from "@/app/controller/controller"
import useAlert from "@/app/hook/useAlert"
import { ExpensesType, TodaysExpensesType } from "@/app/types/type"
import React, { Dispatch, useCallback, useEffect, useState } from "react"
import { CardList } from "../CardList"
import { formatMoney, getExpenseDescription } from "@/app/utils/utils"
import { AppContext } from "@/app/context/context"
import ExpensesFormModal from "./ExpensesFormModal"
import { useDisclosure } from "@nextui-org/react"

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
        const result = await fetchSearch<ExpensesType[]>({ searchText: query })

        setData(result)
        setResult(result)
      } catch (error) {
        showAlert({
          message: "Error fetching data...",
          type: "error",
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

  const findCategory = (categoryID: number) => {
    return context?.categories?.find(({ ID }) => ID === categoryID)
  }

  useEffect(() => {
    fetchData()
  }, [query])

  if (data.length === 0) {
    return null
  }

  return (
    <>
      <ExpensesFormModal
        isOpen={isOpen}
        data={preview}
        onOpenChange={onOpenChange}
        afterHandler={fetchData}
      />
      <div className="flex flex-col">
        {data.map((expense) => (
          <CardList
            key={expense.ID}
            iconName={expense.imgPath}
            title={findCategory(expense.categoryID)?.description}
            description={getExpenseDescription(
              expense.created_on,
              expense.description,
              "ll"
            )}
            value={formatMoney(expense.amount)}
            handleDblClick={() => {
              const newExpense: TodaysExpensesType = {
                ...expense,
                category: findCategory(expense.categoryID)?.description,
              }
              showExpenseDialog(newExpense)
            }}
          />
        ))}
      </div>
    </>
  )
}

export default SearchResults
