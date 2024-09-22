"use client"

import { fetchSearch } from "@/app/controller/controller"
import useAlert from "@/app/hook/useAlert"
import { ExpensesType } from "@/app/types/type"
import React, { Dispatch, useEffect, useRef, useState } from "react"
import { CardList } from "../CardList"
import { formatMoney, getExpenseDescription } from "@/app/utils/utils"
import { AppContext } from "@/app/context/context"

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

  const loadingRef = useRef(false)

  const fetchData = async () => {
    if (query.length !== 0) {
      loadingRef.current = true
      try {
        const result = await fetchSearch<ExpensesType[]>({ searchText: query })

        setData(result)
        setResult(result)
        loadingRef.current = false
      } catch (error) {
        showAlert({
          message: "Error fetching data...",
          type: "error",
        })
        setData([])
        loadingRef.current = false
      }
    } else {
      setData([])
      setResult([])
    }
  }

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
    <div className="flex flex-col">
      {loadingRef.current && <p>Loading...</p>}
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
        />
      ))}
    </div>
  )
}

export default SearchResults
