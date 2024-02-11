"use client"

import React, { useCallback, useEffect, useState } from "react"
import { AppContext } from "../context/context"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react"
import {
  Wrapper,
  WrapperContent,
  WrapperFooter,
  WrapperHeader,
} from "../components/Wrapper"
import {
  CURRENT_MONTHID,
  formatMoney,
  getCurrentMonth,
  getExpenseDescription,
  getIcons,
} from "../utils/utils"
import { FormattedPreviousExpensesType } from "../types/type"
import moment from "moment"
import SuspenseContainer from "../components/SuspenseContainer"
import { CardList } from "../components/CardList"

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

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [monthList, setMonthList] = useState<TMonthList[]>([])
  const [selectedMonth, setSelectedMonth] = useState<TMonthList | null>(null)

  const [preview, setPreview] = useState<FormattedPreviousExpensesType | null>(
    null
  )

  const previewExpense = (expense: FormattedPreviousExpensesType) => {
    setPreview(expense)
    onOpen()
  }

  const findCategory = (categoryID: number) => {
    return context?.categories?.find(({ ID }) => ID === categoryID)
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
      <Modal
        className="border-1 border-border-color bg-container-secondary"
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
                    <span className="font-semibold">
                      {moment(preview?.date).format("ll")}
                    </span>
                  </div>
                  <div className="flex items-center border-1 border-red-800 bg-red-500 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg p-2 justify-between text-default-500 flex-1">
                    <h3>Total: </h3>
                    <span className="font-semibold">
                      {formatMoney(preview?.total ?? 0)}
                    </span>
                  </div>
                </div>
                <ScrollShadow className="flex flex-col max-h-[48vh] overflow-auto">
                  {preview?.expensesList.map((expense) => (
                    <CardList
                      key={expense.ID}
                      iconName={getIcons(expense.categoryID) as string}
                      title={findCategory(expense.categoryID)?.description}
                      description={getExpenseDescription(
                        expense.created_on,
                        expense.description
                      )}
                      value={formatMoney(expense.amount)}
                    />
                  ))}
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
            {formatMoney(totalPreviousExpenses)}
          </p>
        </WrapperFooter>
      </Wrapper>
    </>
  )
}

export default PreviousExpenses
