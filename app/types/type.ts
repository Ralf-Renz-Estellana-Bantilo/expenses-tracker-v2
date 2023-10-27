import { Dispatch, SetStateAction, JSX } from 'react'

export type TabType = {
   ID: number;
   description: string;
   path: string;
   icon: JSX.Element;
}

export type ContextType = {
   tabs: TabType[],
   activeTab: TabType,
   setActiveTab: Dispatch<SetStateAction<TabType>>,
   todayExpenses: {
      category: string | undefined;
      ID: number;
      categoryID: number;
      description?: string | undefined;
      amount: number;
      createdBy: string;
      createdOn: string;
      status: StatusType;
   }[],
   previousExpenses: {
      ID: number,
      date: string;
      total: number;
      expensesList: ExpensesType[];
   }[],
   handleUpdateExpense: ( newExpense: ExpensesType & { category: string | undefined }, type: 'add' | 'edit' ) => void
}

export type StatusType = 0 | 1

export type CategoryType = {
   ID: number;
   description: string;
   icon: string;
   status: StatusType;
}

export type MonthType = {
   ID: number;
   code: string;
   description: string;
   status: number;
}

export type ExpensesType = {
   ID: number;
   categoryID: number;
   description?: string;
   amount: number;
   createdBy: string;
   createdOn: string;
   status: StatusType;
}

export type TodaysExpensesType = {
   category: string | undefined;
   ID: number;
   categoryID: number;
   description?: string | undefined;
   amount: number;
   createdBy: string;
   createdOn: string;
   status: StatusType;
}

export type AlertType = {
   type: 'info' | 'success' | 'error' | 'warning' | 'default',
   message: string,
   position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
   theme?: 'dark' | 'light' | 'colored'
   autoClose?: number
}