"use client"

import {
  Avatar,
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
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  Wrapper,
  WrapperContent,
  WrapperFooter,
  WrapperHeader,
} from "../components/Wrapper"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import {
  CURRENT_MONTHID,
  CURRENT_YEAR,
  formatMoney,
  formatPreviousExpenses,
  getCurrentMonth,
} from "../utils/utils"
import SuspenseContainer from "../components/SuspenseContainer"
import { AppContext } from "../context/context"
import Image from "next/image"
import { CardList } from "../components/CardList"
import {
  FormattedPreviousExpensesType,
  MasterSelectPayloadType,
  MonthlyExpensesBreakdownType,
  MonthlyExpensesType,
  PreviousExpensesType,
} from "../types/type"
import { fetchMasterSelect } from "../controller/controller"
import moment from "moment"
import MonthlyExpensesModal from "./components/MonthlyExpensesModal"

const ProfilePage = () => {
  const context = AppContext()
  const { data: session } = useSession()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [yearList, setYearList] = useState<number[]>([CURRENT_YEAR])
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [expensesList, setExpensesList] = useState<
    FormattedPreviousExpensesType[] | null
  >(null)

  if (!session || !context) {
    redirect("/login")
  }

  const { monthlyExpensesBreakdown, setMonthlyExpensesBreakdown } = context

  const monthlyExpenses: MonthlyExpensesType[] | undefined =
    context.monthlyExpenses?.filter((expense) => expense.year === selectedYear)

  const totalExpenses: number = useMemo(() => {
    const result =
      monthlyExpenses?.reduce(
        (sum, item) => Number(sum) + Number(item.total),
        0
      ) ?? 0

    return result
  }, [monthlyExpenses])

  const onSelectMonth = useCallback(
    async ({ monthID, year }: MonthlyExpensesType) => {
      const cachedID = `${monthID}-${year}`
      const hasCachedData = Object.hasOwn(monthlyExpensesBreakdown, cachedID)

      let result = undefined
      if (hasCachedData) {
        result = monthlyExpensesBreakdown[cachedID]
      } else {
        const payload: MasterSelectPayloadType<PreviousExpensesType> = {
          table: "previous_expenses_view",
          filter: {
            monthID,
            year,
            created_by: session.user?.email ?? "",
          },
          sort: {
            ID: "ASC",
          },
        }
        const response = (await fetchMasterSelect(
          payload
        )) as PreviousExpensesType[]
        result = formatPreviousExpenses(response)

        const cachedInfo: MonthlyExpensesBreakdownType = {}
        cachedInfo[cachedID] = result
        setMonthlyExpensesBreakdown((prev) => ({
          ...prev,
          ...cachedInfo,
        }))
      }

      setExpensesList(result)
      onOpen()
    },
    [setExpensesList, setMonthlyExpensesBreakdown, monthlyExpensesBreakdown]
  )

  useEffect(() => {
    if (!context) return

    const yearList = [
      ...new Set(context.monthlyExpenses?.map((expense) => expense.year)),
    ].sort((a, b) => b - a)

    setYearList([...new Set([CURRENT_YEAR, ...yearList])])
  }, [])

  return (
    <>
      <MonthlyExpensesModal
        expensesList={expensesList}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center justify-center gap-1">
          <Avatar
            src={
              session.user?.image ||
              "https://i.pravatar.cc/150?u=a042581f4e29026024d"
            }
            className="w-32 h-32 text-large"
            isBordered
          />
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-accent-primary text-2xl font-bold text-center">
              {session.user?.name}
            </h2>
            <small className="text-default-500 text-center">
              {session.user?.email}
            </small>
          </div>
        </div>
        <Wrapper>
          <WrapperHeader className="flex items-center justify-between">
            <h3 className="font-semibold text-accent-secondary">
              Monthly Expenses
            </h3>
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
          </WrapperHeader>
          <WrapperContent className="flex flex-col" scrollable>
            <SuspenseContainer data={monthlyExpenses}>
              {monthlyExpenses?.map((month, index) => (
                <CardList
                  key={index}
                  iconName={month.monthCode}
                  handleClick={() => onSelectMonth(month)}
                  title={month.month}
                  value={formatMoney(month.total, context.isMasked)}
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
      </div>
    </>
  )
}

export default ProfilePage
