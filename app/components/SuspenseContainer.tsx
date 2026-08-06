import { Chip } from '@nextui-org/react'
import React, { ReactNode } from 'react'
import { WarningIcon } from '../icons/icons'
import { CardListSkeleton } from './CardList'

export default function SuspenseContainer<T extends { length: number }>({
    children,
    data,
    noDataMsg,
}: {
    children: ReactNode
    data: T | null | undefined
    noDataMsg?: string
}) {
    if (!data) {
        return <CardListSkeleton />
    } else {
        return data.length > 0 ? (
            <>{children}</>
        ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
                <div className="p-3 rounded-full bg-warning-500/10 border border-warning-500/30">
                    <WarningIcon className="w-6 h-6 text-warning-400" />
                </div>
                <Chip variant="light" color="warning">
                    {noDataMsg || 'No data found!'}
                </Chip>
            </div>
        )
    }
}
