"use client"

import { fetchSearch } from "@/app/controller/controller"
import useAlert from "@/app/hook/useAlert"
import { ExpensesType } from "@/app/types/type"
import React, { useEffect, useRef, useState } from "react"
import { CardList } from "../CardList"
import { formatMoney, getExpenseDescription, getIcons } from "@/app/utils/utils"
import { AppContext } from "@/app/context/context"

const SearchResults = ({ query }: { query: string }) => {
  const context = AppContext()
  const [data, setData] = useState<ExpensesType[]>([])
  const { showAlert } = useAlert()

  const fetchData = async () => {
    if (query.length !== 0) {
      try {
        const result = await fetchSearch<ExpensesType[]>({ searchText: query })

        setData(result)
      } catch (error) {
        showAlert({
          message: "Error fetching data...",
          type: "error",
        })
        setData([])
      }
    }
  }

  const findCategory = (categoryID: number) => {
    return context?.categories?.find(({ ID }) => ID === categoryID)
  }

  useEffect(() => {
    ;(async function () {
      await fetchData()
    })()
  }, [query])

  if (query.length === 0) {
    return <div>Type to search...</div>
  }

  if (data.length === 0) {
    return <div>No results found for "{query}"</div>
  }

  return (
    <div className="flex flex-col">
      {data.map((expense) => (
        <CardList
          key={expense.ID}
          iconName={getIcons(expense.categoryID) as string}
          title={findCategory(expense.categoryID)?.description}
          description={getExpenseDescription(
            expense.created_on,
            expense.description,
            "ll"
          )}
          value={formatMoney(expense.amount)}
        />
      ))}
    </div>
  )
}

export default SearchResults
