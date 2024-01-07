import { Dispatch, SetStateAction, JSX, MutableRefObject } from "react"

export type TabType = {
  ID: number
  description: string
  path: string
  icon: JSX.Element
}

export type ContextType = {
  tabs: TabType[]
  activeTab: TabType
  categories: CategoryType[] | null
  todayExpenses: TodaysExpensesType[] | null
  previousExpenses: PreviousExpensesType[] | null
  monthlyExpenses: MonthlyExpensesType[] | null
  walletBudget: WalletBudgeType[] | null
  isMasked: boolean
  isTodayExpensePending: MutableRefObject<boolean>
  isWalletBudgetPending: MutableRefObject<boolean>
  summary: DashboardSummaryType | null
  setIsMasked: Dispatch<SetStateAction<boolean>>
  setActiveTab: Dispatch<SetStateAction<TabType>>
  handleUpdateExpense: (
    newExpense: ExpensesType & { category: string | undefined },
    type: "add" | "edit"
  ) => void
  handleUpdateWalletBudget: (
    newBudget: WalletBudgeType,
    type: "add" | "edit"
  ) => void
}

export type StatusType = 0 | 1

export interface CategoryType {
  ID: number
  description: string
  imgPath?: string
  status: StatusType
}

export interface MonthType {
  ID: number
  code: string
  description: string
  status: number
}

export interface ExpensesType {
  ID: number
  categoryID: number
  description?: string
  amount: number
  created_by?: string
  created_on?: string
  status?: StatusType
}

export interface TodaysExpensesType extends ExpensesType {
  category: string | undefined
}

export interface PreviousExpensesType {
  ID?: number
  date: string
  total: number
  expensesList: ExpensesType[]
}

export type AlertType = {
  type: "info" | "success" | "error" | "warning" | "default"
  message: string
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-right"
    | "bottom-left"
    | "bottom-center"
  theme?: "dark" | "light" | "colored"
  timeout?: number
}

export interface MasterSelectPayloadType {
  table: string
  filter?: any
  column?: string
  sort?: any
}

export interface MasterDataPayloadType {
  tables: string
}

export interface SaveDataPayloadType {
  table: string
  values: any
  key?: any
}

export interface SaveDataResponseType {
  affectedRows: number
  changedRows: number
  fieldCount: number
  info: string
  insertId: number
  serverStatus: number
  warningStatus: number
}

export interface MonthlyExpensesType {
  user: string
  monthID: number
  month: string
  monthCode: string
  year: number
  total: number
}

export interface WalletBudgeType {
  ID: number
  title: string
  description: string
  amount: number
  created_by?: string
  created_on?: string
  status?: StatusType
}

export interface AnalyticsPercentageType {
  categoryID: number
  category: string
  total: string
  monthly_total: string
  percentage: string
  created_by: string
}

export interface AnalyticsDailyAverageType {
  user: string
  daily_average: number
}

export interface AnalyticsMonthlyAverageType {
  user: string
  monthly_average: number
}

export interface DashboardSummaryType {
  totalExpenses: string | number
  totalBudget: string | number
  totalBalance: string | number
}
