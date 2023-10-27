import { CategoryType, ExpensesType, MonthType } from "../types/type";
import moment from 'moment'

export const CATEGORIES_TABLE: CategoryType[] = [
   {
      ID: 1,
      description: 'Foods & Drinks',
      icon: '',
      status: 1,
   },
   {
      ID: 2,
      description: 'Transportation',
      icon: '',
      status: 1,
   },
   {
      ID: 3,
      description: 'Load/Communication',
      icon: '',
      status: 1,
   },
   {
      ID: 4,
      description: 'Life Insurance',
      icon: '',
      status: 1,
   },
   {
      ID: 5,
      description: 'Rent',
      icon: '',
      status: 1,
   },
   {
      ID: 6,
      description: 'Electric Bill',
      icon: '',
      status: 1,
   },
   {
      ID: 7,
      description: 'Water Bill',
      icon: '',
      status: 1,
   },
   {
      ID: 8,
      description: 'Family',
      icon: '',
      status: 1,
   },
]

export const MONTHS_TABLE: MonthType[] = [
   {
      ID: 1,
      code: 'jan',
      description: 'January',
      status: 1,
   },
   {
      ID: 2,
      code: 'feb',
      description: 'February',
      status: 1,
   },
   {
      ID: 3,
      code: 'mar',
      description: 'March',
      status: 1,
   },
   {
      ID: 4,
      code: 'apr',
      description: 'April',
      status: 1,
   },
   {
      ID: 5,
      code: 'may',
      description: 'May',
      status: 1,
   },
   {
      ID: 6,
      code: 'jun',
      description: 'June',
      status: 1,
   },
   {
      ID: 7,
      code: 'jul',
      description: 'July',
      status: 1,
   },
   {
      ID: 8,
      code: 'aug',
      description: 'August',
      status: 1,
   },
   {
      ID: 9,
      code: 'sep',
      description: 'September',
      status: 1,
   },
   {
      ID: 10,
      code: 'oct',
      description: 'October',
      status: 1,
   },
   {
      ID: 11,
      code: 'nov',
      description: 'November',
      status: 1,
   },
   {
      ID: 12,
      code: 'dec',
      description: 'December',
      status: 1,
   },
]

const MAX_AMOUNT = 1_000

export const EXPENSES_TABLE: ExpensesType[] = [
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: 'Snack',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Tue Oct 10 2023 07:12:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 2,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Tue Oct 10 2023 08:42:56 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Tue Oct 10 2023 08:52:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Tue Oct 10 2023 10:12:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 3,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Tue Oct 10 2023 10:32:03 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Tue Oct 10 2023 17:12:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 2,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Tue Oct 10 2023 17:45:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Wed Oct 11 2023 09:12:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 2,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Wed Oct 11 2023 09:22:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 5,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Wed Oct 11 2023 09:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 6,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Wed Oct 11 2023 19:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Thu Oct 12 2023 07:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Thu Oct 12 2023 08:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 2,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Thu Oct 12 2023 09:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 3,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Thu Oct 12 2023 10:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Thu Oct 12 2023 11:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Thu Oct 12 2023 12:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 5,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Thu Oct 12 2023 13:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 2,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Fri Oct 13 2023 07:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Fri Oct 13 2023 08:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Fri Oct 13 2023 09:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Fri Oct 13 2023 10:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 7,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Sat Oct 14 2023 10:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 8,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: 'Sat Oct 14 2023 16:32:53 GMT+0800 (Taipei Standard Time)',
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 1,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: `${new Date()}`,
      status: 1,
   },
   {
      ID: Math.floor( Math.random() * 1_000_000 ),
      categoryID: 2,
      description: '',
      amount: Math.floor( Math.random() * MAX_AMOUNT ),
      createdBy: 'ralfrenzbantilo@gmail.com',
      createdOn: `${new Date()}`,
      status: 1,
   },
]

const formatDate = ( date: string ) =>
{
   return moment( date ).format( 'l' )
}

export const TODAYS_EXPENSES_VIEW = ( user = 'ralfrenzbantilo@gmail.com' ) =>
{
   // const user = 'ralfrenzbantilo@gmail.com'
   const today = new Date().toLocaleDateString()

   const filterExpenses = EXPENSES_TABLE.filter( ( expense ) => formatDate( expense.createdOn ) === today && expense.createdBy === user )

   const refactorExpenses = Array.from( filterExpenses, ( expense ) =>
   {
      const category = CATEGORIES_TABLE.find( ( { ID } ) => ID === expense.categoryID )?.description

      return {
         ...expense,
         category
      }
   } )

   const result: typeof refactorExpenses = refactorExpenses
   return Array.from( result, ( res, index ) => { return { ...res, ID: index } } )
}

export const PREVIOUS_EXPENSES_VIEW = ( user = 'ralfrenzbantilo@gmail.com' ) =>
{
   // const user = 'ralfrenzbantilo@gmail.com'
   const currentMonth = new Date().getMonth() + 1
   const currentYear = new Date().getFullYear()

   const filterPreviousExpenses: ExpensesType[] = []
   EXPENSES_TABLE.forEach( expense =>
   {

      const today = new Date().toLocaleDateString()
      const month = Number( formatDate( expense.createdOn ).split( '/' )[0] )
      const year = Number( formatDate( expense.createdOn ).split( '/' )[2] )

      if ( ( month === currentMonth && year === currentYear && user === expense.createdBy ) && formatDate( expense.createdOn ) !== today )
      {
         filterPreviousExpenses.push( expense )
      }
   } )

   filterPreviousExpenses.sort( function ( a, b )
   {
      let dateA = new Date( a.createdOn ) as any;
      let dateB = new Date( b.createdOn ) as any;

      return dateB - dateA
   } );

   const uniqueDate = [...new Set( filterPreviousExpenses.map( exp => formatDate( exp.createdOn ) ) )]

   const result = Array.from( uniqueDate, date =>
   {
      const filterExpensesPerDate = filterPreviousExpenses.filter( exp => formatDate( exp.createdOn ) === formatDate( date ) )
      let total = 0
      filterExpensesPerDate.forEach( ( { amount } ) => total += amount )

      return {
         date,
         total,
         expensesList: filterExpensesPerDate
      }
   } )


   return Array.from( result, ( res, index ) => { return { ...res, ID: index } } )
}