'use client'

import React from 'react'
import CustomizedLabelLineChart from '../../components/charts/CustomizedLabelLineChart'
import { Button } from '@nextui-org/react'
import { EllipsisVertical } from '../../icons/icons'
import { Wrapper } from '../../components/Wrapper'

const ExpensesGraph = () => {
    return (
        <Wrapper className="flex flex-col p-3 gap-2">
            <div className="flex items-center justify-between">
                <h3 className="text-center font-semibold text-accent-primary">
                    Expenses Graph ( Past 7 days )
                </h3>
                <Button
                    isIconOnly
                    color="default"
                    variant="light"
                    aria-label="Take a photo"
                >
                    <EllipsisVertical />
                </Button>
            </div>
            <div className="h-[50vh]">
                <CustomizedLabelLineChart />
            </div>
        </Wrapper>
    )
}

export default ExpensesGraph
