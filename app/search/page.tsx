'use client'

import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { SearchIcon } from '../icons/icons'
import { Input } from '@nextui-org/react'
import { formatMoney } from '../utils/utils'
import {
    Wrapper,
    WrapperContent,
    WrapperFooter,
    WrapperHeader,
} from '../components/Wrapper'
import useDelay from '../hook/useDelay'
import SearchResults from '../components/modals/SearchResults'
import { ExpensesType } from '../types/type'
import { AppContext } from '../context/context'

const SearchPage = () => {
    const { selectedColor } = AppContext()
    const [query, setQuery] = useState('')
    const [result, setResult] = useState<ExpensesType[]>([])
    const deferredQuery = useDelay(query, 1000)

    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value.trimStart())
        },
        []
    )

    const totalExpenses: number = useMemo(() => {
        return (
            result?.reduce(
                (accumulator, item) =>
                    Number(accumulator) + Number(item.amount),
                0
            ) ?? 0
        )
    }, [result])

    return (
        <div className="flex flex-col gap-2">
            <Wrapper>
                <WrapperHeader>
                    <div className="flex flex-col gap-2">
                        <div className="flex">
                            <Input
                                variant="bordered"
                                label="Search Expenses"
                                autoFocus
                                isClearable
                                color={selectedColor.background}
                                onClear={() => setQuery('')}
                                value={query}
                                radius="lg"
                                onChange={handleInputChange}
                                placeholder="Type to search..."
                                startContent={<SearchIcon />}
                            />
                        </div>
                        {query && (
                            <div className="flex items-center justify-between">
                                <span>Results Found:</span>
                                <b>{result.length}</b>
                            </div>
                        )}
                    </div>
                </WrapperHeader>
                <WrapperContent scrollable maxScrollableHeight="70vh">
                    <SearchResults
                        query={deferredQuery}
                        setResult={setResult}
                    />
                </WrapperContent>
                {result.length > 0 && (
                    <WrapperFooter className="flex items-center justify-between">
                        <h3 className="text-default-500">Total:</h3>
                        <p className="text-default-500">
                            {' '}
                            {formatMoney(totalExpenses)}
                        </p>
                    </WrapperFooter>
                )}
            </Wrapper>
        </div>
    )
}

export default SearchPage
