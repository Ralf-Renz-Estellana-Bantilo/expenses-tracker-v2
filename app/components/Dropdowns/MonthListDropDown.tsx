'use client'

import { AppContext } from '@/app/context/context'
import { TMonthList } from '@/app/dashboard/components/PreviousExpenses'
import { CURRENT_MONTHID, getCurrentMonth } from '@/app/utils/utils'
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

interface IMonthList {
    value: TMonthList
    onChange: (item: TMonthList) => void
}

const CURRENT_MONTH: TMonthList = {
    month: getCurrentMonth(),
    monthID: CURRENT_MONTHID,
}

const MonthListDropDown = ({ value, onChange }: IMonthList) => {
    const context = AppContext()
    const { previousExpenses, selectedColor } = context
    const [monthList, setMonthList] = useState<TMonthList[]>([])

    useEffect(() => {
        const result: TMonthList[] = []

        for (let index = 1; index <= CURRENT_MONTHID; index++) {
            result.push({
                month: getCurrentMonth(index),
                monthID: index,
            })
        }

        setMonthList(result.sort((a, b) => b.monthID - a.monthID))

        const previousExpensesList = previousExpenses ?? []
        const monthlyExpenseSummary: TMonthList =
            previousExpensesList.length > 0
                ? {
                      month: getCurrentMonth(previousExpensesList[0].monthID),
                      monthID: previousExpensesList[0].monthID,
                  }
                : CURRENT_MONTH
        onChange(monthlyExpenseSummary)
    }, [])

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="light">{value?.month}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions">
                {monthList.map((item) => (
                    <DropdownItem
                        key={item.monthID}
                        color={
                            item.monthID === value?.monthID
                                ? selectedColor.background
                                : 'default'
                        }
                        className={
                            item.monthID === value?.monthID
                                ? `bg-${selectedColor.background}`
                                : ''
                        }
                        onClick={() => onChange(item)}
                    >
                        {item.month}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    )
}

export default MonthListDropDown
