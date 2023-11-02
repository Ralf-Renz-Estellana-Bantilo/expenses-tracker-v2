'use client'

import { ScrollShadow } from '@nextui-org/react'
import React, { ReactNode } from 'react'

const Wrapper = ( { children, className }: { children: ReactNode, className?: string } ) =>
{
   return (
      <div className={`bg-slate-500 backdrop-filter backdrop-blur-sm bg-opacity-10 p-2 border-1 border-border-color rounded-lg ${className}`}>{children}</div>
   )
}

const WrapperHeader = ( { children, className }: { children: ReactNode, className?: string } ) =>
{
   return (
      <div className={`border-b-1 border-border-color pb-2 ${className}`}>{children}</div>
   )
}

const WrapperContent = ( { children, className, scrollable }: { children: ReactNode, className?: string, scrollable?: boolean } ) =>
{
   return (
      <ScrollShadow className={`py-2 ${className} ${scrollable && 'max-h-[50vh]'}`}>{children}</ScrollShadow>
   )
}

const WrapperFooter = ( { children, className }: { children: ReactNode, className?: string } ) =>
{
   return (
      <div className={`border-t-1 border-border-color pt-2 ${className}`}>{children}</div>
   )
}



export { Wrapper, WrapperHeader, WrapperContent, WrapperFooter }