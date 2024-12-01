"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  Wrapper,
  WrapperContent,
  WrapperFooter,
  WrapperHeader,
} from "../components/Wrapper"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import { PlusIcon } from "../icons/icons"
import {
  CURRENT_YEAR,
  formatMoney,
  getExpenseDescription,
} from "../utils/utils"
import { AppContext } from "../context/context"
import { WalletBudgeType } from "../types/type"
import SuspenseContainer from "../components/SuspenseContainer"
import { CardList, CardListSkeleton } from "../components/CardList"
import useAlert from "../hook/useAlert"

const DEFAULT_FORM = {
  ID: 0,
  title: "",
  description: "",
  amount: "",
  header: "Add New Wallet Budget",
}

const WalletMaintenance = () => {
  const context = AppContext()
  if (!context) return

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [yearList, setYearList] = useState<number[]>([CURRENT_YEAR])
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)

  const handleSave = (onClose: () => void) => {
    const { showAlert } = useAlert()
    const { ID, amount, description, title } = formData

    if (
      title !== "" &&
      description !== "" &&
      amount !== "" &&
      Number(amount) !== 0
    ) {
      const ACTION_TYPE = ID === DEFAULT_FORM.ID ? "add" : "edit"

      const dateObj = new Date()
      const isoDate = dateObj.toISOString()

      const { handleUpdateWalletBudget } = context
      const newBudget: WalletBudgeType = {
        ID,
        title,
        description,
        amount: Number(amount),
        created_on: `${isoDate}`,
      }

      handleUpdateWalletBudget(newBudget, ACTION_TYPE)

      const alertMessage =
        ACTION_TYPE === "add"
          ? "New expense has been added!"
          : "Expense has been updated!"

      setFormData(DEFAULT_FORM)
      showAlert({ type: "success", message: alertMessage })
      onClose()
    } else {
      showAlert({ type: "warning", message: "Error! Form data is invalid!" })
    }
  }

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleKeyPress = (
    { key }: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent,
    onClose: () => void
  ) => {
    if (key === "Enter") {
      handleSave(onClose)
    }
  }

  const showWalletBudgetDialog = useCallback(
    (walletBudget: WalletBudgeType | null) => {
      const isMasked = context.isMasked ?? false
      if (!isMasked) {
        const walletBudgetForm = walletBudget
          ? {
              header: "Update Wallet Budget",
              ID: walletBudget.ID,
              title: walletBudget.title,
              description: walletBudget.description,
              amount: `${walletBudget.amount}`,
            }
          : DEFAULT_FORM

        onOpen()
        setFormData(walletBudgetForm)
      }
    },
    [context.isMasked, onOpen, setFormData]
  )

  const extractYear = (created_on: string | undefined) => {
    return created_on ? Number(created_on.slice(0, 4)) : 2000
  }

  useEffect(() => {
    const yearList = [
      ...new Set(context.monthlyExpenses?.map((expense) => expense.year)),
    ].sort((a, b) => b - a)

    setYearList([...new Set([CURRENT_YEAR, ...yearList])])
  }, [])

  const walletBudgetList = useMemo(
    () =>
      context.walletBudget?.filter(
        (budget) => extractYear(budget.created_on) == selectedYear
      ) ?? [],
    [context.walletBudget, selectedYear]
  )

  const totalExpenses: number = useMemo(() => {
    const result =
      walletBudgetList?.reduce(
        (sum, item) => Number(sum) + Number(item.amount),
        0
      ) ?? 0

    return result
  }, [walletBudgetList])

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
                {formData.header}
              </ModalHeader>
              <ModalBody className="flex flex-col gap-2">
                <Input
                  value={formData.title}
                  onChange={handleChangeInput}
                  onKeyDown={(event) => handleKeyPress(event, onClose)}
                  name="title"
                  color="primary"
                  label="Budget Title"
                  isRequired
                  placeholder="Enter budget title"
                  variant="bordered"
                />
                <Input
                  value={formData.description}
                  onChange={handleChangeInput}
                  onKeyDown={(event) => handleKeyPress(event, onClose)}
                  name="description"
                  color="primary"
                  isRequired
                  label="Short description"
                  placeholder="Enter short description"
                  variant="bordered"
                />
                <Input
                  value={formData.amount}
                  onChange={handleChangeInput}
                  onKeyDown={(event) => handleKeyPress(event, onClose)}
                  name="amount"
                  color="primary"
                  label="Amount"
                  isRequired
                  type="number"
                  placeholder="Enter amount"
                  variant="bordered"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">₱</span>
                    </div>
                  }
                />
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
      <Wrapper>
        <WrapperHeader className="flex items-center justify-between">
          <h3 className="font-semibold text-accent-secondary">
            Wallet Budget Maintenance
          </h3>
          <div className="flex items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light">{selectedYear}</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions">
                {yearList.map((year) => (
                  <DropdownItem
                    key={year}
                    color={year === selectedYear ? "primary" : "default"}
                    className={year === selectedYear ? "bg-primary" : ""}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              isIconOnly
              color="primary"
              variant="light"
              aria-label="Take a photo"
              size="sm"
              onClick={() => showWalletBudgetDialog(null)}
            >
              <PlusIcon />
            </Button>
          </div>
        </WrapperHeader>
        <WrapperContent className="flex flex-col" scrollable>
          <SuspenseContainer data={context?.walletBudget}>
            {context?.isWalletBudgetPending.current && <CardListSkeleton />}
            {walletBudgetList.map((budget) => (
              <CardList
                key={budget.ID}
                iconName="peso"
                title={budget.title}
                description={getExpenseDescription(
                  budget.created_on,
                  budget.description,
                  "l"
                )}
                value={formatMoney(budget.amount, context.isMasked)}
                handleDblClick={() => showWalletBudgetDialog(budget)}
              />
            ))}
          </SuspenseContainer>
        </WrapperContent>
        <WrapperFooter className="flex items-center justify-between">
          <h3 className="text-default-500">Total:</h3>
          <p className="text-default-500">
            {" "}
            {formatMoney(totalExpenses, context.isMasked)}
          </p>
        </WrapperFooter>
      </Wrapper>
    </>
  )
}

export default WalletMaintenance
