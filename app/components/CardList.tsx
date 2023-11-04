import React from 'react'
import Image from 'next/image'

type CardListType = {
   title: string | undefined,
   description?: string | undefined,
   value?: string | number,
   iconName?: string | undefined
   handleClick?: () => any,
   handleDblClick?: () => any,
}

const CardList = ( { iconName, title, description, value, handleClick, handleDblClick }: CardListType ) =>
{
   const singleClick = () =>
   {
      if ( handleClick )
      {
         handleClick()
      }
   }

   const doubleClick = () =>
   {
      if ( handleDblClick )
      {
         handleDblClick()
      }
   }

   return (
      <div className="flex p-2 justify-between items-center border-1 cursor-pointer border-transparent hover:border-slate-700 rounded-lg hover:bg-slate-500 hover:backdrop-filter hover:backdrop-blur-sm hover:bg-opacity-10" onClick={singleClick} onDoubleClick={doubleClick}>
         <div className="flex items-center gap-3">
            {iconName && <Image src={require( `@/public/assets/icons/${iconName}.png` ).default} alt='icon' height={27} />}

            <div className="flex flex-col">
               <span>{title}</span>
               <small className='text-default-500 whitespace-nowrap overflow-clip text-ellipsis max-w-xs'>{description}</small>
            </div>
         </div>
         <span className='text-accent-secondary font-semibold'> {value}</span>
      </div>
   )
}

export default CardList