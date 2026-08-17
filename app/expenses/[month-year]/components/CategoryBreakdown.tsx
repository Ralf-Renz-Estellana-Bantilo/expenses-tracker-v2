'use client'

import SuspenseContainer from '@/app/components/SuspenseContainer'
import { Wrapper, WrapperHeader } from '@/app/components/Wrapper'
import { ResponseCacheContext } from '@/app/context/cacheContext'
import { useAppContext } from '@/app/context/context'
import { fetchMonthlyPercentageBreakdown } from '@/app/controller/controller'
import { AnalyticsPercentageType } from '@/app/types/type'
import {
    formatMoney,
    iconFilterModerator,
    setRandomColor,
} from '@/app/utils/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Props = {
    monthID: number
    year: number
}

const CategoryBreakdown = ({ monthID, year }: Props) => {
    const cacheContext = ResponseCacheContext()
    const { selectedColor } = useAppContext()

    const [percentageBreakdown, setPercentageBreakdown] = useState<
        AnalyticsPercentageType[] | null
    >(null)

    useEffect(() => {
        const load = async () => {
            if (!cacheContext) return
            const { useResponse } = cacheContext
            const cacheID = `${monthID}-${year}-mpb`

            try {
                const response = await useResponse<AnalyticsPercentageType[]>(
                    cacheID,
                    () => fetchMonthlyPercentageBreakdown({ monthID, year })
                )

                if (response) {
                    const sorted = [...response].sort(
                        (a, b) => Number(b.percentage) - Number(a.percentage)
                    )
                    setPercentageBreakdown(sorted)
                } else {
                    setPercentageBreakdown([])
                }
            } catch {
                setPercentageBreakdown([])
            }
        }
        load()
    }, [monthID, year, cacheContext?.cacheList])

    return (
        <Wrapper className="flex flex-col p-3 gap-2">
            <WrapperHeader className="flex items-center justify-between">
                <h3 className="font-semibold text-accent-primary">
                    Category Percentage Breakdown
                </h3>
            </WrapperHeader>
            <div className="flex flex-col">
                <SuspenseContainer data={percentageBreakdown}>
                    {percentageBreakdown?.map((data) => (
                        <div
                            className={`${selectedColor.background} flex gap-2 items-center px-1 py-2 rounded-lg`}
                            key={data.categoryID}
                        >
                            {data.imgPath && (
                                <Image
                                    src={
                                        require(
                                            `@/public/assets/icons/${data.imgPath}.png`
                                        ).default
                                    }
                                    alt="icon"
                                    width={27}
                                    height={27}
                                    style={{
                                        filter: iconFilterModerator(
                                            selectedColor.background
                                        ),
                                    }}
                                />
                            )}
                            <div className="flex flex-col flex-1 gap-1">
                                <div className="flex justify-between">
                                    <h3 className="text-sm text-accent-secondary">
                                        {data.category}
                                    </h3>
                                    <span className="text-sm text-accent-secondary">
                                        {`${formatMoney(data.total)} => ${
                                            data.percentage
                                        }`}
                                        %
                                    </span>
                                </div>
                                <div className="flex rounded-md overflow-hidden">
                                    <div
                                        className="h-2"
                                        style={{
                                            width: `${data.percentage}%`,
                                            backgroundColor: setRandomColor(
                                                data.categoryID
                                            ),
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: `${100 - +data.percentage}%`,
                                            backgroundColor: setRandomColor(
                                                data.categoryID
                                            ),
                                            opacity: 0.1,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </SuspenseContainer>
            </div>
        </Wrapper>
    )
}

export default CategoryBreakdown
