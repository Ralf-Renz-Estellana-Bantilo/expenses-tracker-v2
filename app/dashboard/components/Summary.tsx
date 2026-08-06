'use client'

import React from 'react'
import { Wrapper } from '../../components/Wrapper'
import { useAppContext } from '../../context/context'
import { formatMoney } from '../../utils/utils'
import useCredit from '../../hook/useCredit'

const Summary = () => {
    const context = useAppContext()
    const { isMasked, selectedColor } = context

    const { totalBalance, totalBudget, totalExpenses } = useCredit()

    return (
        <Wrapper className="flex flex-col">
            <div className="flex items-center justify-between py-3">
                <p className="text-accent-primary text-lg font-semibold">
                    Total Balance
                </p>
                <span
                    className={`text-${selectedColor.background} font-bold text-4xl`}
                >
                    {formatMoney(totalBalance, isMasked)}
                </span>
            </div>

            <div className="flex gap-2">
                <div className="flex items-center justify-between border border-green-700/60 bg-green-500/10 backdrop-blur-sm rounded-xl p-3 flex-1 max-[420px]:flex-col transition-all duration-200 hover:bg-green-500/15 hover:border-green-600/70 shadow-sm shadow-green-900/20">
                    <p className="text-accent-secondary text-sm">
                        Total Budget
                    </p>
                    <span className="text-accent-secondary font-bold whitespace-nowrap">
                        {formatMoney(totalBudget, isMasked)}
                    </span>
                </div>
                <div className="flex items-center justify-between border border-red-700/60 bg-red-500/10 backdrop-blur-sm rounded-xl p-3 flex-1 max-[420px]:flex-col transition-all duration-200 hover:bg-red-500/15 hover:border-red-600/70 shadow-sm shadow-red-900/20">
                    <p className="text-accent-secondary text-sm">
                        Total Expenses
                    </p>
                    <span className="text-accent-secondary font-bold whitespace-nowrap">
                        {formatMoney(totalExpenses)}
                    </span>
                </div>
            </div>
        </Wrapper>
    )
}

export default Summary
