import moment from "moment"
import { TodaysExpensesType } from "../types/type"


export const formatMoney = ( money: string | number, isSecret?: boolean ) =>
{
   const amount = Number( Number( money ).toFixed( 2 ) )
   const result = amount.toLocaleString( undefined, { minimumFractionDigits: 2 } )

   return isSecret ? `₱ ${maskNumber( `${amount}` )}` : `₱ ${result}`
}

export const formatDate = ( date: string ) =>
{
   return moment( date ).format( 'l' )
}

export const formatPreviousExpenses = ( previousExpenses: TodaysExpensesType[] ) =>
{
   previousExpenses.sort( function ( a, b )
   {
      let dateA = `${new Date( a.created_on as string )}` as any;
      let dateB = `${new Date( b.created_on as string )}` as any;

      return dateB - dateA
   } );

   const uniqueDate = [...new Set( previousExpenses.map( exp => formatDate( exp.created_on as string ) ) )]

   const result = Array.from( uniqueDate, date =>
   {
      const filterExpensesPerDate = previousExpenses.filter( exp => formatDate( exp.created_on as string ) === formatDate( date ) )
      let total = 0
      filterExpensesPerDate.forEach( ( { amount } ) => total += Number( amount ) )

      return {
         date,
         total,
         expensesList: filterExpensesPerDate
      }
   } )


   return Array.from( result, ( res, index ) => { return { ...res, ID: index } } )
}

export const getCurrentMonth = () =>
{
   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
   ];

   const monthIndex = new Date().getMonth()
   return monthNames[monthIndex]
}

export const maskNumber = ( money: string ) =>
{
   try
   {
      const parts = money.split( '.' );
      if ( parts.length === 2 )
      {
         const integerPart = parts[0];
         const decimalPart = parts[1];
         const maskedInteger = '*'.repeat( integerPart.length - 3 ) + integerPart.slice( -3 );
         return `${maskedInteger}.${decimalPart}`;
      } else
      {
         return money; // No decimal part to mask
      }
   } catch ( error )
   {
      return money
   }
}

export const getIcons = ( ID?: number ) =>
{
   let icons = [
      'food',
      'transportation',
      'communication',
      'insurance',
      'rent',
      'bill',
      'family',
      'clothes',
      'shopping'
   ]

   return ID ? icons[( ID - 1 ) % icons.length] : icons
}