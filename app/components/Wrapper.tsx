"use client"

import { ScrollShadow } from "@nextui-org/react"
import React, { DetailedHTMLProps, HTMLAttributes } from "react"

const Wrapper = (
  props?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
  return (
    <div
      {...props}
      className={`bg-slate-500 backdrop-filter backdrop-blur-sm bg-opacity-10 p-2 border-1 border-border-color rounded-lg ease-in-out duration-75 ${props?.className} hover:border-[#314153]`}
    >
      {props?.children}
    </div>
  )
}

const WrapperHeader = (
  props?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
  return (
    <div
      {...props}
      className={`border-b-1 border-border-color pb-2 ${props?.className}`}
    >
      {props?.children}
    </div>
  )
}

const WrapperContent = (
  props?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    scrollable?: boolean
  }
) => {
  return (
    <ScrollShadow
      className={`py-2 ${props?.className} ${
        props?.scrollable && "max-h-[50vh]"
      }`}
    >
      {props?.children}
    </ScrollShadow>
  )
}

const WrapperFooter = (
  props?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
  return (
    <div className={`border-t-1 border-border-color pt-2 ${props?.className}`}>
      {props?.children}
    </div>
  )
}

export { Wrapper, WrapperHeader, WrapperContent, WrapperFooter }
