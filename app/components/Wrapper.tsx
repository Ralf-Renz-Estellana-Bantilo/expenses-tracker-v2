'use client'

import { ScrollShadow } from '@nextui-org/react'
import React, { DetailedHTMLProps, HTMLAttributes } from 'react'
import { AppContext } from '../context/context'

const Wrapper = (
    props?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
    const context = AppContext()
    const { selectedColor } = context

    return (
        <div
            {...props}
            className={`bg-slate-500 backdrop-filter backdrop-blur-sm bg-opacity-10 p-2 rounded-lg ease-in-out duration-75 ${props?.className}`}
            style={{
                border: `1px solid ${selectedColor.properties.borderColor}`,
            }}
        >
            {props?.children}
        </div>
    )
}

type TWrapperHeader = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & { hasBorder?: boolean }
const WrapperHeader = (props?: TWrapperHeader) => {
    const context = AppContext()
    const { selectedColor } = context

    const hasBorder = props?.hasBorder !== undefined ? props.hasBorder : true

    return (
        <div
            {...props}
            className={`${hasBorder ? 'pb-2' : ''}  ${props?.className}`}
            style={{
                borderBottom: hasBorder
                    ? `1px solid ${selectedColor.properties.borderColor}`
                    : undefined,
            }}
        >
            {props?.children}
        </div>
    )
}

const WrapperContent = (
    props?: DetailedHTMLProps<
        HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > & {
        scrollable?: boolean
        maxScrollableHeight?: string
    }
) => {
    const maxHeight = props?.maxScrollableHeight
        ? `max-h-[${props?.maxScrollableHeight}]`
        : 'max-h-[50vh]'
    return (
        <ScrollShadow
            className={`py-2 ${props?.className} ${
                props?.scrollable && maxHeight
            }`}
        >
            {props?.children}
        </ScrollShadow>
    )
}

const WrapperFooter = (
    props?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
    const context = AppContext()
    const { selectedColor } = context

    return (
        <div
            className={`pt-2 ${props?.className}`}
            style={{
                borderTop: `1px solid ${selectedColor.properties.borderColor}`,
            }}
        >
            {props?.children}
        </div>
    )
}

export { Wrapper, WrapperHeader, WrapperContent, WrapperFooter }
