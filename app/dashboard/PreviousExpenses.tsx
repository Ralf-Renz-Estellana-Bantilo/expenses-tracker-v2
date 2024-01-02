"use client"

import React, { useMemo, useState } from "react"
import { AppContext } from "../context/context"
import {
  Button,
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
  formatMoney,
  getCurrentMonth,
  getExpenseDescription,
  getIcons,
} from "../utils/utils"
import { PreviousExpensesType, TodaysExpensesType } from "../types/type"
import moment from "moment"
import SuspenseContainer from "../components/SuspenseContainer"
import Image from "next/image"
import { CardList } from "../components/CardList"

const PreviousExpenses = () => {
  const context = AppContext()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [preview, setPreview] = useState<PreviousExpensesType | null>(null)

  const previewExpense = (expense: PreviousExpensesType) => {
    setPreview(expense)
    onOpen()
  }

  const findCategory = (categoryID: number) => {
    return context?.categories?.find(({ ID }) => ID === categoryID)
  }

  const totalPreviousExpenses: number = useMemo(() => {
    const result =
      context?.previousExpenses?.reduce(
        (accumulator, item) => Number(accumulator) + Number(item.total),
        0
      ) ?? 0

    return result
  }, [context?.previousExpenses])

  const monthCode = getCurrentMonth().slice(0, 3).toUpperCase()

  return (
    <>
      <Modal
        className="border-1 border-border-color bg-container-primary"
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
                    <span
                      className="font-semibold
                              "
                    >
                      {preview?.date}
                    </span>
                  </div>
                  <div className="flex items-center border-1 border-red-800 bg-red-500 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg p-2 justify-between text-default-500 flex-1">
                    <h3>Total: </h3>
                    <span
                      className="font-semibold
                              "
                    >
                      {" "}
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
            Previous Expenses{" "}
            <code className="font-normal">({getCurrentMonth()})</code>{" "}
          </h3>
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
