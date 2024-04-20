"use client"

import {
  Wrapper,
  WrapperContent,
  WrapperFooter,
  WrapperHeader,
} from "@/app/components/Wrapper"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import MonthlyExpensesModal from "./MonthlyExpensesModal"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react"
import SuspenseContainer from "@/app/components/SuspenseContainer"
import {
  CURRENT_MONTHID,
  CURRENT_YEAR,
  formatMoney,
  formatPreviousExpenses,
} from "@/app/utils/utils"
import { AppContext } from "@/app/context/context"
import { useSession } from "next-auth/react"
import {
  FormattedPreviousExpensesType,
  MasterSelectPayloadType,
  MonthlyExpensesBreakdownType,
  MonthlyExpensesType,
  PreviousExpensesType,
} from "@/app/types/type"
import { redirect } from "next/navigation"
import { fetchMasterSelect } from "@/app/controller/controller"
import { CardList } from "@/app/components/CardList"

const MonthlyExpensesList = () => {
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

  const {
    monthlyExpensesBreakdown,
    setMonthlyExpensesBreakdown,
    todayExpenses,
  } = context

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
      const isMasked = context.isMasked ?? false
      if (!isMasked) {
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
              status: 1,
            },
            sort: {
              ID: "ASC",
            },
          }
          let response = (await fetchMasterSelect(
            payload
          )) as PreviousExpensesType[]

          if (CURRENT_MONTHID === monthID) {
            if (todayExpenses) {
              const allTodayExpenses: PreviousExpensesType[] = Array.from(
                todayExpenses,
                (exp) => {
                  const result: PreviousExpensesType = {
                    ...exp,
                    year: CURRENT_YEAR,
                    monthID: CURRENT_MONTHID,
                  }
                  return result
                }
              )
              response = [...response, ...allTodayExpenses]
            }
          }

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
      }
    },
    [
      setExpensesList,
      setMonthlyExpensesBreakdown,
      monthlyExpensesBreakdown,
      context.isMasked,
    ]
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
                handleDblClick={() => onSelectMonth(month)}
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
    </>
  )
}

export default MonthlyExpensesList
