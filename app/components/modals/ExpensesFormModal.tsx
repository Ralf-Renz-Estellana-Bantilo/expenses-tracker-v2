"use client"

import { AppContext } from "@/app/context/context"
import {
  ExpenseFormType,
  ExpensesModalType,
  StatusType,
  TodaysExpensesType,
} from "@/app/types/type"
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react"
import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import useAlert from "@/app/hook/useAlert"
import useCredit from "@/app/hook/useCredit"
import { ResponseCacheContext } from "@/app/context/cacheContext"
import { CURRENT_MONTHID, CURRENT_YEAR, formatMoney } from "@/app/utils/utils"
import { CustomLogger, LogLevel } from "@/app/utils/logger"

const DEFAULT_FORM: ExpenseFormType = {
  ID: 0,
  categoryID: "1",
  description: "",
  amount: "",
  header: "Add New Expense",
  status: 1,
}

const ExpensesFormModal = ({
  isOpen,
  onOpenChange,
  data,
  afterHandler,
}: ExpensesModalType<TodaysExpensesType>) => {
  const { data: session } = useSession()
  const context = AppContext()
  const cacheContext = ResponseCacheContext()
  const { totalBalance } = useCredit()
  const [formData, setFormData] = useState<ExpenseFormType>(DEFAULT_FORM)
  const { showAlert } = useAlert()
  const [availableCredit, setAvailableCredit] = useState(0)

  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value } = e.target

      if (name === "status") {
        const statusValue = value ? +value : 1
        setFormData({ ...formData, [name]: statusValue })
      } else {
        setFormData({ ...formData, [name]: value })
      }
    },
    [data, setFormData, formData]
  )

  const handleSave = useCallback(
    (onClose: () => void): void => {
      const { ID, amount, categoryID, description, status } = formData

      if (categoryID !== "" && Number(amount) >= 0 && amount !== "") {
        if (context) {
          const { handleUpdateExpense, categories, isTodayExpensePending } =
            context

          isTodayExpensePending.current = true

          const ACTION_TYPE = ID === DEFAULT_FORM.ID ? "add" : "edit"

          const categoryList = categories?.find(
            (cat) => cat.ID === Number(formData.categoryID)
          )

          const newExpense: TodaysExpensesType = {
            ID,
            category: categoryList?.description,
            categoryID: Number(categoryID),
            description,
            amount: Number(amount),
            created_by: session?.user?.email || "",
            created_on: `${new Date()}`,
            status: status as StatusType,
          }

          handleUpdateExpense(newExpense, ACTION_TYPE)
            .then(() => {
              const alertMessage =
                ACTION_TYPE === "add"
                  ? "New expense has been added!"
                  : "Expense has been updated!"

              setFormData(DEFAULT_FORM)
              showAlert({ type: "success", message: alertMessage })

              if (cacheContext) {
                const { removeCacheByID } = cacheContext
                const cachedID = `${CURRENT_MONTHID}-${CURRENT_YEAR}-mel`
                removeCacheByID(cachedID)
              }

              onClose()
            })
            .catch((error) => {
              showAlert({ type: "error", message: "Something went wrong!" })
              const logger = new CustomLogger(LogLevel.ERROR)
              logger.error(error)
            })
            .finally(() => {
              isTodayExpensePending.current = false
            })
        }
      } else {
        showAlert({ type: "warning", message: "Error! Form data is invalid!" })
      }

      if (afterHandler) {
        afterHandler(formData)
      }
    },
    [formData, afterHandler, context, showAlert, session, cacheContext]
  )

  const handleKeyPress = useCallback(
    (
      { key }: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent,
      onClose: () => void
    ): void => {
      if (key === "Enter") {
        handleSave(onClose)
      }
    },
    [handleSave]
  )

  const isInvalid = useMemo((): { status: boolean; message: string } => {
    const currentAmount = Number(formData.amount)
    let status: boolean = currentAmount > availableCredit
    let message: string = ""

    if (status) {
      message = `Error! Insufficient balance! ${formatMoney(
        availableCredit - currentAmount
      )}`
    } else if (currentAmount < 0 && formData.amount !== "") {
      message = "Error! Invalid amount!"
      status = true
    }

    return { status, message }
  }, [formData.amount, totalBalance])

  useEffect(() => {
    let totalAmount = 0
    if (data) {
      const { ID, amount, categoryID, description, status } = data
      setFormData({
        ID,
        amount: amount.toString(),
        categoryID: categoryID.toString(),
        description: description ?? "",
        header: "Update Expense",
        status: status ?? 1,
      })

      totalAmount = amount
    } else {
      setFormData(DEFAULT_FORM)
    }
    setAvailableCredit(Number(totalAmount) + totalBalance)

    return () => {
      setFormData(DEFAULT_FORM)
      setAvailableCredit(0)
    }
  }, [isOpen, data])

  return (
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
              {formData.header}
            </ModalHeader>
            <ModalBody>
              {context?.categories && (
                <Select
                  label="Select category"
                  variant="bordered"
                  color="primary"
                  isRequired
                  selectedKeys={[formData.categoryID]}
                  onChange={handleChangeInput}
                  name="categoryID"
                >
                  {context?.categories.map((category) => (
                    <SelectItem
                      color="primary"
                      startContent={
                        <Image
                          src={
                            require(`@/public/assets/icons/${category.imgPath}.png`)
                              .default
                          }
                          alt="icon"
                          height={27}
                        />
                      }
                      key={category.ID}
                      value={category.ID}
                    >
                      {category.description}
                    </SelectItem>
                  ))}
                </Select>
              )}
              <Input
                value={formData.description}
                onChange={handleChangeInput}
                onKeyDown={(event) => handleKeyPress(event, onClose)}
                name="description"
                label="Short description"
                placeholder="Enter short description"
                variant="bordered"
                color="primary"
              />
              <Input
                value={formData.amount}
                onChange={handleChangeInput}
                onKeyDown={(event) => handleKeyPress(event, onClose)}
                name="amount"
                isInvalid={isInvalid.status}
                color={isInvalid.status ? "warning" : "primary"}
                errorMessage={isInvalid.status && isInvalid.message}
                isRequired
                label="Amount"
                type="number"
                placeholder="Enter amount"
                variant="bordered"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₱</span>
                  </div>
                }
              />
              {formData.header === "Update Expense" && (
                <Select
                  label="Select status"
                  variant="bordered"
                  isRequired
                  color="primary"
                  selectedKeys={[formData.status.toString()]}
                  onChange={handleChangeInput}
                  name="status"
                >
                  {[0, 1].map((status) => (
                    <SelectItem color="primary" key={status} value={status}>
                      {status.toString()}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" color="danger" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={() => handleSave(onClose)}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default memo(ExpensesFormModal)
