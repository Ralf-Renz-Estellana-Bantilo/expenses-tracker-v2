import { Chip, Skeleton, Spinner } from '@nextui-org/react'
import React, { ReactNode } from 'react'
import { WarningIcon } from '../icons/icons';
import { CardListSkeleton } from './CardList';

export default function SuspenseContainer<T extends { length: number }> ( { children, data, noDataMsg }: { children: ReactNode, data: T | null | undefined, noDataMsg?: string } )
{
   if ( data === null || data === undefined )
   {
      return (
         // <div className='text-center pt-2'>
         //    <Spinner />
         // </div>
         <CardListSkeleton />
      );
   } else
   {
      return data.length > 0 ? <>{children}</> : <div className='text-center pt-1'>
         <Chip
            startContent={<WarningIcon className='w-4 h-4' />}
            variant="light"
            color="warning"
         >
            {noDataMsg || 'No data found!'}
         </Chip>
      </div>
   }
}