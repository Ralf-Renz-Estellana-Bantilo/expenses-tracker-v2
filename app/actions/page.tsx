'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { TodaysExpensesType, ExpenseFormType, TDate } from '../types/type'
import { fetchActionFilter } from '../controller/controller'
import {
    Wrapper,
    WrapperContent,
    WrapperFooter,
    WrapperHeader,
} from '../components/Wrapper'
import {
    Button,
    DatePicker,
    Select,
    SelectItem,
    Tooltip,
    useDisclosure,
} from '@nextui-org/react'
import useCategory from '../hook/useCategory'
import Image from 'next/image'
import SuspenseContainer from '../components/SuspenseContainer'
import { CardList } from '../components/CardList'
import { formatMoney, getExpenseDescription } from '../utils/utils'
import ExpensesFormModal from '../components/modals/ExpensesFormModal'
import {
    ArrowDownIcon,
    ArrowUpIcon,
    MinusIcon,
    RefreshIcon,
} from '../icons/icons'
import { AppContext } from '../context/context'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'

const EXPENSES_COLUMNS = {
    ID: 'exp.ID',
    amount: 'CAST(exp.amount as unsigned)',
    category: 'exp.category',
    categoryID: 'exp.categoryID',
    description: 'exp.description',
}

type TDateRange = {
    dateStart: TDate
    dateEnd: TDate
}

type TFilters = {
    category: string
    sort: string
    order: string
}

const ActionCenterPage = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const context = AppContext()
    const { selectedColor, categories, isMasked } = context

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const categoryList = useCategory()
    const sortList = [
        {
            ID: 1,
            label: 'Ascending',
            value: 'ASC',
        },
        {
            ID: 2,
            label: 'Descending',
            value: 'DESC',
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
    const [expensesList, setExpensesList] = useState<
        TodaysExpensesType[] | null
    >([])

    const [dateRange, setDateRange] = useState<TDateRange>({
        dateStart: searchParams.get('dateStart')
            ? parseDate(searchParams.get('dateStart')?.toString() ?? '')
            : undefined,
        dateEnd: searchParams.get('dateEnd')
            ? parseDate(searchParams.get('dateEnd')?.toString() ?? '')
            : undefined,
    })

    const [filters, setFilters] = useState<TFilters>({
        category: searchParams.get('category')?.toString() ?? '',
        sort: searchParams.get('sort')?.toString() ?? '',
        order: searchParams.get('order')?.toString() ?? '',
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

    const handleChangeDateRange = (
        value: TDate,
        state: 'dateStart' | 'dateEnd'
    ) => {
        setDateRange((prevState) => ({ ...prevState, [state]: value }))
    }

    const findCategory = (categoryID: number) => {
        return categories?.find(({ ID }) => ID === categoryID)
    }

    const onUpdate = ({ header, ...restData }: ExpenseFormType) => {
        const updatedExpense = expensesList?.map((exp) =>
            exp.ID === restData.ID
                ? {
                      ...exp,
                      ...restData,
                      category: findCategory(Number(restData.categoryID))
                          ?.description,
                  }
                : exp
        ) as TodaysExpensesType[]

        const filterActiveExpenses = updatedExpense.filter(
            (exp) => exp.status == 1
        )

        setExpensesList(filterActiveExpenses)
    }

    const getExpenses = async () => {
        const { category, sort, order } = filters
        const { dateStart, dateEnd } = dateRange

        const allFilter = { ...filters, ...dateRange }

        const params = new URLSearchParams(searchParams as any)

        let hasSavedFilter = false

        for (const [key, value] of Object.entries(allFilter)) {
            if (value) {
                hasSavedFilter = true
                params.set(`${key}`, `${value}`)
            } else {
                params.delete(`${key}`)
            }
        }

        if (hasSavedFilter) {
            const newURL = [`${pathname}`, `${params.toString()}`].join('?')

            replace(newURL)
            setExpensesList(null)

            try {
                const result = (await fetchActionFilter({
                    dateStart: dateStart?.toString() ?? '',
                    dateEnd: dateEnd?.toString() ?? '',
                    category,
                    sort,
                    order,
                })) as TodaysExpensesType[]

                setExpensesList(result)
            } catch (error) {
                setExpensesList([])
            }
        }
    }

    const clearFilter = () => {
        setFilters({
            category: '',
            order: '',
            sort: '',
        })
        setDateRange({
            dateStart: null as any,
            dateEnd: null as any,
        })

        replace(pathname)
        setExpensesList([])
    }

    useEffect(() => {
        getExpenses()
    }, [])

    const isPending = expensesList === null

    const selectedCategoryKeys = filters.category
        ? filters.category.split(',')
        : []
    const selectedSortKeys = filters.sort ? filters.sort.split(',') : []
    const selectedOrderKeys = filters.order ? filters.order.split(',') : []

    const resultSum: number = useMemo(() => {
        const result =
            expensesList?.reduce(
                (accumulator, item) =>
                    Number(accumulator) + Number(item.amount),
                0
            ) ?? 0

        return result
    }, [expensesList])

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
                    <WrapperHeader
                        className="flex items-center justify-between"
                        hasBorder={isExpanded}
                    >
                        <h3 className="font-semibold text-accent-secondary">
                            Select Filter Options
                        </h3>
                        <div className="flex gap-2">
                            <Tooltip color="warning" content="Clear Filters">
                                <Button
                                    isIconOnly
                                    color="default"
                                    size="sm"
                                    variant="light"
                                    aria-label="Clear Filters"
                                    onClick={clearFilter}
                                    isDisabled={isPending}
                                >
                                    <MinusIcon />
                                </Button>
                            </Tooltip>

                            <Tooltip
                                color={selectedColor.background}
                                content={isExpanded ? 'Collapse' : 'Expand'}
                            >
                                <Button
                                    isIconOnly
                                    color={selectedColor.background}
                                    size="sm"
                                    variant="light"
                                    aria-label="Collapse"
                                    onClick={() =>
                                        setIsExpanded((prev) => !prev)
                                    }
                                    isDisabled={isPending}
                                >
                                    {isExpanded ? (
                                        <ArrowDownIcon />
                                    ) : (
                                        <ArrowUpIcon />
                                    )}
                                </Button>
                            </Tooltip>
                        </div>
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
                                    color={selectedColor.background}
                                    isDisabled={isPending}
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
                                <div className="flex gap-2">
                                    <DatePicker
                                        name="dateStart"
                                        color={selectedColor.background}
                                        value={dateRange.dateStart}
                                        onChange={(date) =>
                                            handleChangeDateRange(
                                                date,
                                                'dateStart'
                                            )
                                        }
                                        maxValue={
                                            dateRange.dateEnd ??
                                            today(getLocalTimeZone()).subtract({
                                                days: 1,
                                            })
                                        }
                                        label="Date start"
                                        variant="bordered"
                                        isRequired={
                                            dateRange.dateEnd ? true : false
                                        }
                                        isDisabled={isPending}
                                    />
                                    <DatePicker
                                        name="dateEnd"
                                        color={selectedColor.background}
                                        value={dateRange.dateEnd}
                                        onChange={(date) =>
                                            handleChangeDateRange(
                                                date,
                                                'dateEnd'
                                            )
                                        }
                                        minValue={dateRange.dateStart}
                                        maxValue={today(getLocalTimeZone())}
                                        label="Date end"
                                        variant="bordered"
                                        isRequired={
                                            dateRange.dateStart ? true : false
                                        }
                                        isDisabled={isPending}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Select
                                        label="Sort Direction"
                                        variant="bordered"
                                        placeholder="Select sorting direction"
                                        name="sort"
                                        color={selectedColor.background}
                                        selectedKeys={selectedSortKeys}
                                        onChange={handleChangeInput}
                                        className="flex-1"
                                        isDisabled={isPending}
                                    >
                                        {sortList.map((sort) => (
                                            <SelectItem
                                                key={sort.value}
                                                value={sort.value}
                                            >
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
                                        color={selectedColor.background}
                                        selectedKeys={selectedOrderKeys}
                                        onChange={handleChangeInput}
                                        className="flex-1"
                                        isDisabled={isPending}
                                    >
                                        {orderList.map((column) => (
                                            <SelectItem
                                                key={column.value}
                                                value={column.value}
                                            >
                                                {column.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <Button
                                    color={selectedColor.background}
                                    onClick={getExpenses}
                                    isDisabled={isPending}
                                >
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

                        <Tooltip color="success" content="Refresh">
                            <Button
                                isIconOnly
                                color="success"
                                size="sm"
                                variant="light"
                                aria-label="Take a photo"
                                onClick={() => setExpensesList([])}
                                isDisabled={isPending}
                            >
                                <RefreshIcon />
                            </Button>
                        </Tooltip>
                    </WrapperHeader>
                    <WrapperContent className="flex flex-col max-h-[70vh]">
                        <SuspenseContainer data={expensesList}>
                            {expensesList?.map((expense) => (
                                <CardList
                                    key={expense.ID}
                                    title={expense.category}
                                    description={getExpenseDescription(
                                        expense.created_on ?? '',
                                        expense.description,
                                        'll'
                                    )}
                                    iconName={expense.imgPath}
                                    value={formatMoney(expense.amount)}
                                    handleDblClick={() =>
                                        showExpenseDialog(expense)
                                    }
                                />
                            ))}
                        </SuspenseContainer>
                    </WrapperContent>
                    <WrapperFooter className="flex items-center justify-between">
                        <h3 className="text-default-500">Total:</h3>
                        <p className="text-default-500">
                            {formatMoney(resultSum, isMasked)}
                        </p>
                    </WrapperFooter>
                </Wrapper>
            </div>
        </>
    )
}

export default ActionCenterPage
