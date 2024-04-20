"use client"

import React, { useEffect, useState } from "react"
import { TodaysExpensesType, ExpenseFormType } from "../types/type"
import { useSession } from "next-auth/react"
import { fetchActionFilter } from "../controller/controller"
import { Wrapper, WrapperContent, WrapperHeader } from "../components/Wrapper"
import { Button, Select, SelectItem, useDisclosure } from "@nextui-org/react"
import useMonth from "../hook/useMonth"
import useYear from "../hook/useYear"
import useCategory from "../hook/useCategory"
import Image from "next/image"
import SuspenseContainer from "../components/SuspenseContainer"
import { CardList } from "../components/CardList"
import { formatMoney, getExpenseDescription, getIcons } from "../utils/utils"
import ExpensesFormModal from "../components/modals/ExpensesFormModal"
import { ArrowDownIcon, ArrowUpIcon, RefreshIcon } from "../icons/icons"
import { AppContext } from "../context/context"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const EXPENSES_COLUMNS = {
  ID: "exp.ID",
  amount: "CAST(exp.amount as unsigned)",
  category: "exp.category",
  categoryID: "exp.categoryID",
  description: "exp.description",
  // created_by: 'exp.created_by',
  // created_on: 'exp.created_on',
  // status: 'exp.status',
}

const ActionCenterPage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const context = AppContext()

  const { data: session } = useSession()
  const user = session?.user?.email ?? "unknown@user.com"

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const monthList = useMonth()
  const yearList = useYear()
  const categoryList = useCategory()
  const sortList = [
    {
      ID: 1,
      label: "Ascending",
      value: "ASC",
    },
    {
      ID: 2,
      label: "Descending",
      value: "DESC",
    },
  ]
  const orderList = Array.from(
    Object.keys(EXPENSES_COLUMNS),
    (column, index) => {
      return {
        ID: index,
        label: column,
        value: Object.values(EXPENSES_COLUMNS)[index],
      }
    }
  )

  const [preview, setPreview] = useState<TodaysExpensesType | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [expensesList, setExpensesList] = useState<TodaysExpensesType[] | null>(
    []
  )

  const [filters, setFilters] = useState({
    month: searchParams.get("month")?.toString() ?? "",
    year: searchParams.get("year")?.toString() ?? "",
    category: searchParams.get("category")?.toString() ?? "",
    sort: searchParams.get("sort")?.toString() ?? "",
    order: searchParams.get("order")?.toString() ?? "",
  })

  const showExpenseDialog = (expense: TodaysExpensesType | null) => {
    onOpen()
    setPreview(expense)
  }

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target
    setFilters((prevState) => ({ ...prevState, [name]: value }))
  }

  const findCategory = (categoryID: number) => {
    return context?.categories?.find(({ ID }) => ID === categoryID)
  }

  const onUpdate = ({ header, ...restData }: ExpenseFormType) => {
    const updatedExpense = expensesList?.map((exp) =>
      exp.ID === restData.ID
        ? {
            ...exp,
            ...restData,
            category: findCategory(Number(restData.categoryID))?.description,
          }
        : exp
    ) as TodaysExpensesType[]

    setExpensesList(updatedExpense)
  }

  const getExpenses = async () => {
    const { category, month, year, sort, order } = filters
    const params = new URLSearchParams(searchParams)

    let hasSavedFilter = false

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        hasSavedFilter = true
        params.set(`${key}`, `${value}`)
      } else {
        params.delete(`${key}`)
      }
    }

    if (hasSavedFilter) {
      const newURL = [`${pathname}`, `${params.toString()}`].join("?")

      replace(newURL)
      setExpensesList(null)

      try {
        const result = (await fetchActionFilter({
          user,
          category,
          month,
          year,
          sort,
          order,
        })) as TodaysExpensesType[]

        setExpensesList(result)
      } catch (error) {
        setExpensesList([])
      }
    }
  }

  useEffect(() => {
    getExpenses()
  }, [])

  const selectedCategoryKeys = filters.category
    ? filters.category.split(",")
    : undefined
  const selectedMonthKeys = filters.month ? filters.month.split(",") : undefined
  const selectedYearKeys = filters.year ? filters.year.split(",") : undefined
  const selectedSortKeys = filters.sort ? filters.sort.split(",") : undefined
  const selectedOrderKeys = filters.order ? filters.order.split(",") : undefined

  return (
    <>
      <ExpensesFormModal
        isOpen={isOpen}
        data={preview}
        onOpenChange={onOpenChange}
        afterHandler={onUpdate}
      />
      <div className="flex flex-col gap-2">
        <Wrapper className="flex flex-col gap-2">
          <WrapperHeader className="flex items-center justify-between">
            <h3 className="font-semibold text-accent-secondary">
              Select Filter Options
            </h3>
            <Button
              isIconOnly
              color="primary"
              size="sm"
              variant="light"
              aria-label="Take a photo"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </Button>
          </WrapperHeader>
          {isExpanded && (
            <WrapperContent>
              <div className="flex flex-col gap-2">
                <Select
                  label="Categories"
                  variant="bordered"
                  placeholder="Select category/ies"
                  selectionMode="multiple"
                  name="category"
                  selectedKeys={selectedCategoryKeys}
                  onChange={handleChangeInput}
                  className="flex-1"
                >
                  {categoryList.map((category) => (
                    <SelectItem
                      key={category.value}
                      value={category.value}
                      startContent={
                        <Image
                          src={
                            require(`@/public/assets/icons/${category.icon}.png`)
                              .default
                          }
                          alt="icon"
                          height={27}
                        />
                      }
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Month"
                  variant="bordered"
                  placeholder="Select month/s"
                  selectionMode="multiple"
                  name="month"
                  selectedKeys={selectedMonthKeys}
                  onChange={handleChangeInput}
                  className="flex-1"
                >
                  {monthList.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value}
                      startContent={
                        <Image
                          src={
                            require(`@/public/assets/icons/${month.code}.png`)
                              .default
                          }
                          alt="icon"
                          height={27}
                        />
                      }
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Year"
                  variant="bordered"
                  placeholder="Select year/s"
                  selectionMode="multiple"
                  name="year"
                  selectedKeys={selectedYearKeys}
                  onChange={handleChangeInput}
                  className="flex-1"
                >
                  {yearList.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex gap-2">
                  <Select
                    label="Sort Direction"
                    variant="bordered"
                    placeholder="Select sorting direction"
                    name="sort"
                    selectedKeys={selectedSortKeys}
                    onChange={handleChangeInput}
                    className="flex-1"
                  >
                    {sortList.map((sort) => (
                      <SelectItem key={sort.value} value={sort.value}>
                        {sort.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Order By"
                    variant="bordered"
                    placeholder="Select column/s"
                    selectionMode="multiple"
                    name="order"
                    selectedKeys={selectedOrderKeys}
                    onChange={handleChangeInput}
                    className="flex-1"
                  >
                    {orderList.map((column) => (
                      <SelectItem key={column.value} value={column.value}>
                        {column.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <Button color="primary" onClick={getExpenses}>
                  Generate
                </Button>
              </div>
            </WrapperContent>
          )}
        </Wrapper>
        <Wrapper>
          <WrapperHeader className="flex items-center justify-between">
            <h3 className="font-semibold text-accent-secondary">
              Results {`[ ${expensesList?.length ?? 0} ]`}
            </h3>
            <Button
              isIconOnly
              color="warning"
              size="sm"
              variant="light"
              aria-label="Take a photo"
              onClick={() => setExpensesList([])}
            >
              <RefreshIcon />
            </Button>
          </WrapperHeader>
          <WrapperContent className="flex flex-col max-h-[70vh]">
            <SuspenseContainer data={expensesList}>
              {expensesList?.map((expense) => (
                <CardList
                  key={expense.ID}
                  title={expense.category}
                  description={getExpenseDescription(
                    expense.created_on ?? "",
                    expense.description,
                    "ll"
                  )}
                  iconName={getIcons(expense.categoryID) as string}
                  value={formatMoney(expense.amount)}
                  handleDblClick={() => showExpenseDialog(expense)}
                />
              ))}
            </SuspenseContainer>
          </WrapperContent>
        </Wrapper>
      </div>
    </>
  )
}

export default ActionCenterPage
