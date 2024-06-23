import { DateValue } from "@nextui-org/react"
import { Dispatch, SetStateAction, JSX, MutableRefObject } from "react"

interface TAuthor {
  created_by?: string
  created_on?: string
}

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
  previousExpenses: FormattedPreviousExpensesType[] | null
  monthlyExpenses: MonthlyExpensesType[] | null
  walletBudget: WalletBudgeType[] | null
  isMasked: boolean
  isTodayExpensePending: MutableRefObject<boolean>
  isWalletBudgetPending: MutableRefObject<boolean>
  isLoadingState: MutableRefObject<boolean>
  summary: DashboardSummaryType | null
  monthlyExpensesBreakdown: MonthlyExpensesBreakdownType
  setMonthlyExpensesBreakdown: Dispatch<
    SetStateAction<MonthlyExpensesBreakdownType>
  >
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
  getPreviousExpenses: (monthID: number) => void
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

export interface ExpensesType extends TAuthor {
  ID: number
  categoryID: number
  description?: string
  amount: number
  status?: StatusType
}

export interface TodaysExpensesType extends ExpensesType {
  category: string | undefined
}

export interface PreviousExpensesType extends TodaysExpensesType {
  monthID: number
  year: number
}

export interface FormattedPreviousExpensesType {
  ID?: number
  date: string
  total: number
  expensesList: ExpensesType[]
  monthID: number
  year: number
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

type SortDirection = "DESC" | "ASC"

export interface MasterSelectPayloadType<T> {
  table: string
  filter?: Partial<T>
  column?: Array<keyof T & string>
  sort?: { [K in keyof T]?: SortDirection }
}

export interface MasterSelectPayload {
  table: string
  filter?: unknown
  column?: string[]
  sort?: unknown
}

export interface MasterDataPayloadType<T> {
  tables: Array<keyof T & string>
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

export interface WalletBudgeType extends TAuthor {
  ID: number
  title: string
  description: string
  amount: number
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
  numberOfDays: number
  totalExpenses: number
  dailyAverage: number
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

export interface DailyExpensesType extends TAuthor {
  amount: number
}

export interface MonthlyExpensesBreakdownType {
  [key: string]: FormattedPreviousExpensesType[]
}

export type ExpenseFormType = {
  ID: number
  categoryID: string
  description: string
  amount: string
  header: string
  status: number
}

export type ExpensesModalType<T> = {
  isOpen: boolean
  onOpenChange: () => void
  data: T | null
  onClick?: () => void
  onDblClick?: () => void
  afterHandler?: (newData: ExpenseFormType) => void
}

export type SizeType = "xs" | "sm" | "md" | "lg" | "xl"

export type TDate = DateValue | undefined
