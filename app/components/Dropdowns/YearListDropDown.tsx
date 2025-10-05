'use client'

import { AppContext } from '@/app/context/context'
import { CURRENT_YEAR } from '@/app/utils/utils'
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

interface IYearList {
    value: number
    onChange: (item: number) => void
}

const YearListDropDown = ({ value, onChange }: IYearList) => {
    const context = AppContext()
    const { selectedColor, monthlyExpenses } = context

    const [yearList, setYearList] = useState<number[]>([CURRENT_YEAR])

    useEffect(() => {
        const yearList = [
            ...new Set(monthlyExpenses?.map((expense) => expense.year)),
        ].sort((a, b) => b - a)

        setYearList([...new Set([CURRENT_YEAR, ...yearList])])
    }, [])

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="light">{value}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Year list">
                {yearList.map((year) => (
                    <DropdownItem
                        key={year}
                        color={
                            year === value
                                ? selectedColor.background
                                : 'default'
                        }
                        className={
                            year === value
                                ? `bg-${selectedColor.background}`
                                : ''
                        }
                        onClick={() => onChange(year)}
                    >
                        {year}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    )
}

export default YearListDropDown
