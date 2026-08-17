'use client'

import { Wrapper } from '@/app/components/Wrapper'
import { useAppContext } from '@/app/context/context'
import { FormattedPreviousExpensesType } from '@/app/types/type'
import { formatMoney } from '@/app/utils/utils'
import { useMemo } from 'react'

type Props = {
    expensesList: FormattedPreviousExpensesType[] | null
}

const StatCard = ({
    label,
    value,
}: {
    label: string
    value: string | number
}) => (
    <Wrapper className="flex flex-col border-1 flex-1 p-2 min-w-0">
        <h3 className="text-center text-xs text-accent-secondary">{label}</h3>
        <span className="text-lg font-semibold text-accent-primary text-center whitespace-nowrap overflow-hidden text-ellipsis">
            {value}
        </span>
    </Wrapper>
)

const BreakdownStats = ({ expensesList }: Props) => {
    const { isMasked } = useAppContext()

    const stats = useMemo(() => {
        const activeDays =
            expensesList?.filter((d) => d.expensesList.length > 0) ?? []

        const activeDaysCount = activeDays.length

        const total = activeDays.reduce(
            (sum, item) => sum + Number(item.total),
            0
        )

        const dailyAverage = activeDaysCount > 0 ? total / activeDaysCount : 0

        const highest = activeDays.reduce<FormattedPreviousExpensesType | null>(
            (max, item) =>
                !max || Number(item.total) > Number(max.total) ? item : max,
            null
        )

        return { activeDaysCount, dailyAverage, highest }
    }, [expensesList])

    return (
        <div className="flex gap-2">
            <StatCard
                label="Daily Average"
                value={formatMoney(stats.dailyAverage, isMasked)}
            />
            <StatCard label="Active Days" value={stats.activeDaysCount} />
            <StatCard
                label="Highest Day"
                value={
                    stats.highest
                        ? `${formatMoney(stats.highest.total, isMasked)}`
                        : formatMoney(0, isMasked)
                }
            />
        </div>
    )
}

export default BreakdownStats
