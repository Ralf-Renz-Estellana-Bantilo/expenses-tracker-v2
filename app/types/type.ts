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
   categories: CategoryType[] | null,
   todayExpenses: TodaysExpensesType[] | null,
   previousExpenses: PreviousExpensesType[] | null,
   monthlyExpenses: MonthlyExpensesType[] | null,
   walletBudget: WalletBudgeType[] | null,
   isMasked: boolean,
   setIsMasked: Dispatch<SetStateAction<boolean>>,
   setActiveTab: Dispatch<SetStateAction<TabType>>,
   handleUpdateExpense: ( newExpense: ExpensesType & { category: string | undefined }, type: 'add' | 'edit' ) => void
   handleUpdateWalletBudget: ( newBudget: WalletBudgeType, type: 'add' | 'edit' ) => void
}

export type StatusType = 0 | 1

export type CategoryType = {
   ID: number;
   description: string;
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
   created_by?: string;
   created_on?: string;
   status?: StatusType;
}

export type TodaysExpensesType = {
   ID: number;
   categoryID: number;
   category: string | undefined;
   description?: string | undefined;
   amount: number;
   created_by?: string;
   created_on?: string;
   status?: StatusType;
}

export type PreviousExpensesType = {
   ID?: number,
   date: string;
   total: number;
   expensesList: ExpensesType[];
}

export type AlertType = {
   type: 'info' | 'success' | 'error' | 'warning' | 'default',
   message: string,
   position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
   theme?: 'dark' | 'light' | 'colored'
   autoClose?: number
}

export type MasterSelectPayloadType = {
   table: string,
   filter?: any,
   column?: string,
   sort?: any,
}

export type MasterDataPayloadType = {
   tables: string,
}

export type SaveDataPayloadType = {
   table: string,
   values: any
   key?: any
}

export type SaveDataResponseType = {
   affectedRows: number,
   changedRows: number,
   fieldCount: number,
   info: string,
   insertId: number,
   serverStatus: number,
   warningStatus: number,
}

export type MonthlyExpensesType = {
   user: string,
   monthID: number,
   month: string,
   total: number,
}

export type WalletBudgeType = {
   ID: number,
   title: string,
   description: string,
   amount: number,
   created_by?: string;
   created_on?: string;
   status?: StatusType;
}