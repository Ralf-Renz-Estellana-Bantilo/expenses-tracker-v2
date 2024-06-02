"use client"

import React, { useEffect, useState } from "react"
import { AppContext } from "../context/context"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react"
import {
  Wrapper,
  WrapperContent,
  WrapperFooter,
  WrapperHeader,
} from "../components/Wrapper"
import { CURRENT_MONTHID, formatMoney, getCurrentMonth } from "../utils/utils"
import { FormattedPreviousExpensesType } from "../types/type"
import moment from "moment"
import SuspenseContainer from "../components/SuspenseContainer"
import { CardList } from "../components/CardList"
import ExpensesListModal from "../components/modals/ExpensesListModal"
import useAlert from "../hook/useAlert"

interface TMonthList {
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

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [monthList, setMonthList] = useState<TMonthList[]>([])
  const [selectedMonth, setSelectedMonth] = useState<TMonthList | null>(null)

  const [preview, setPreview] = useState<FormattedPreviousExpensesType | null>(
    null
  )

  const previewExpense = (expense: FormattedPreviousExpensesType) => {
    if (expense.expensesList.length === 0) {
      showAlert({
        message: "Preview unavailable",
        type: "warning",
      })
    } else {
      setPreview(expense)
      onOpen()
    }
  }

  const onSelectMonth = async (item: TMonthList) => {
    if (context) {
      const { getPreviousExpenses } = context
      setSelectedMonth(item)
      getPreviousExpenses(item.monthID)
    }
  }

  const totalPreviousExpenses: number =
    context?.previousExpenses?.reduce(
      (accumulator, item) => Number(accumulator) + Number(item.total),
      0
    ) ?? 0

  useEffect(() => {
    const result: TMonthList[] = []

    for (let index = 1; index <= CURRENT_MONTHID; index++) {
      result.push({
        month: getCurrentMonth(index),
        monthID: index,
      })
    }

    setMonthList(result.sort((a, b) => b.monthID - a.monthID))

    const previousExpenses = context?.previousExpenses ?? []
    const monthlyExpenseSummary: TMonthList =
      previousExpenses.length > 0
        ? {
            month: getCurrentMonth(previousExpenses[0].monthID),
            monthID: previousExpenses[0].monthID,
          }
        : CURRENT_MONTH
    setSelectedMonth(monthlyExpenseSummary)
  }, [])

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
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light">{selectedMonth?.month}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions">
              {monthList.map((item) => (
                <DropdownItem
                  key={item.monthID}
                  color={
                    item.monthID === selectedMonth?.monthID
                      ? "primary"
                      : "default"
                  }
                  className={
                    item.monthID === selectedMonth?.monthID ? "bg-primary" : ""
                  }
                  onClick={() => onSelectMonth(item)}
                >
                  {item.month}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </WrapperHeader>
        <WrapperContent className="flex flex-col" scrollable>
          <SuspenseContainer data={context?.previousExpenses}>
            {context?.previousExpenses?.map((expense) => (
              <CardList
                key={expense.ID}
                iconName={monthCode}
                title={moment(expense.date).format("ll")}
                value={formatMoney(expense.total)}
                handleClick={() => previewExpense(expense)}
              />
            ))}
          </SuspenseContainer>
        </WrapperContent>
        <WrapperFooter className="flex items-center justify-between">
          <h3 className="text-default-500">Total:</h3>
          <p className="text-default-500">
            {" "}
            {formatMoney(totalPreviousExpenses, context?.isMasked)}
          </p>
        </WrapperFooter>
      </Wrapper>
    </>
  )
}

export default PreviousExpenses
