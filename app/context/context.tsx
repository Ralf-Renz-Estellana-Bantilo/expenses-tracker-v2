import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
  useRef,
} from "react"
import { DashboardIcon, ProfileIcon, SettingsIcon } from "../icons/icons"
import {
  CategoryType,
  ContextType,
  MasterSelectPayloadType,
  MonthlyExpensesType,
  FormattedPreviousExpensesType,
  SaveDataPayloadType,
  SaveDataResponseType,
  TabType,
  TodaysExpensesType,
  WalletBudgeType,
  PreviousExpensesType,
  MonthlyExpensesBreakdownType,
  TUsers,
} from "../types/type"
import { redirect, usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { fetchMasterSelect, fetchSaveData } from "../controller/controller"
import {
  CURRENT_MONTHID,
  CURRENT_YEAR,
  formatPreviousExpenses,
  MONTHLIST,
} from "../utils/utils"
import { CustomLogger, LogLevel } from "../utils/logger"
import useAlert from "../hook/useAlert"
import { USERS } from "../api/users/users_db"

export const ComponentContext = createContext<ContextType>({
  tabs: null as any,
  activeTab: null as any,
  todayExpenses: null as any,
  previousExpenses: null as any,
  monthlyExpenses: null as any,
  walletBudget: null as any,
  categories: null as any,
  isMasked: null as any,
  isTodayExpensePending: null as any,
  isWalletBudgetPending: null as any,
  isLoadingState: null as any,
  monthlyExpensesBreakdown: null as any,
  setIsMasked: null as any,
  setActiveTab: null as any,
  handleUpdateExpense: null as any,
  handleUpdateWalletBudget: null as any,
  getPreviousExpenses: null as any,
  setMonthlyExpensesBreakdown: null as any,
})

export default function ComponentContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const logger = new CustomLogger(LogLevel.ERROR)
  const { showAlert } = useAlert()

  const { data: session } = useSession()
  const user = session?.user?.email ?? "unknown@user.com"

  const pathname = usePathname()
  const [tabs] = useState<TabType[]>([
    {
      ID: 1,
      description: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      ID: 2,
      description: "Profile",
      path: "/profile",
      icon: <ProfileIcon />,
    },
    {
      ID: 3,
      description: "Settings",
      path: "/settings",
      icon: <SettingsIcon />,
    },
  ])
  const defaultTabInfo: TabType = {
    ...tabs[0],
    description: "Expenses Tracker",
  }

  const [activeTab, setActiveTab] = useState<TabType>(defaultTabInfo)
  const [todayExpenses, setTodayExpenses] = useState<
    TodaysExpensesType[] | null
  >(null)
  const [previousExpenses, setPreviousExpenses] = useState<
    FormattedPreviousExpensesType[] | null
  >(null)
  const [monthlyExpenses, setMonthlyExpenses] = useState<
    MonthlyExpensesType[] | null
  >(null)
  const [walletBudget, setWalletBudget] = useState<WalletBudgeType[] | null>(
    null
  )
  const [monthlyExpensesBreakdown, setMonthlyExpensesBreakdown] =
    useState<MonthlyExpensesBreakdownType>({})

  const isTodayExpensePending = useRef(false)
  const isWalletBudgetPending = useRef(false)
  const isLoadingState = useRef(false)

  const [isMasked, setIsMasked] = useState(true)

  const [categories, setCategories] = useState<CategoryType[] | null>(null)

  const getTodayExpenses = async () => {
    try {
      const payload: MasterSelectPayloadType<TodaysExpensesType> = {
        table: "today_expenses_view",
        filter: { created_by: user, status: 1 },
        sort: {
          ID: "DESC",
        },
      }
      const response = (await fetchMasterSelect(
        payload
      )) as TodaysExpensesType[]
      setTodayExpenses(response)
    } catch (error) {
      logger.error(error)
      alert(error)
    }
  }

  const getPreviousExpenses = async (
    monthID = CURRENT_MONTHID
  ): Promise<void> => {
    try {
      const payload: MasterSelectPayloadType<PreviousExpensesType> = {
        table: "previous_expenses_view",
        filter: {
          monthID,
          year: CURRENT_YEAR,
          created_by: user,
          status: 1,
        },
        sort: {
          created_on: "DESC",
        },
      }
      const response = (await fetchMasterSelect(
        payload
      )) as PreviousExpensesType[]

      const result = formatPreviousExpenses({
        previousExpenses: response,
        monthID,
        sortOrder: "DESC",
      })

      setPreviousExpenses(result)
    } catch (error) {
      logger.error(error)
      alert(error)
    }
  }

  const getMonthlyExpenses = async () => {
    try {
      const payload: MasterSelectPayloadType<MonthlyExpensesType> = {
        table: "monthly_expenses_view",
        filter: { user },
        sort: { monthID: "ASC" },
      }
      const response = (await fetchMasterSelect(
        payload
      )) as MonthlyExpensesType[]

      const yearList = [...new Set(response.map((res) => res.year))]

      const resultList: MonthlyExpensesType[] = []

      for (let a = 0; a < yearList.length; a++) {
        const year = yearList[a]

        for (let b = 0; b < MONTHLIST.length; b++) {
          const month = MONTHLIST[b]
          const monthCode = month.slice(0, 3).toUpperCase()
          const monthID = b + 1
          const result = {
            month,
            monthCode,
            monthID,
            total: 0,
            user,
            year,
          }

          const res = response.find(
            (res) => res.monthID === monthID && res.year === year
          )

          if (monthID > CURRENT_MONTHID && year == CURRENT_YEAR) {
            continue
          }

          if (res) {
            result.total = res.total
          }

          resultList.push(result)
        }
      }

      setMonthlyExpenses(resultList)
    } catch (error) {
      logger.error(error)
      alert(error)
    }
  }

  const getBudgetWallet = async () => {
    try {
      const payload: MasterSelectPayloadType<WalletBudgeType> = {
        table: "wallet_budget",
        filter: {
          created_by: user,
          status: 1,
        },
        sort: {
          ID: "DESC",
        },
      }
      const response = (await fetchMasterSelect(payload)) as WalletBudgeType[]
      setWalletBudget(response)
    } catch (error) {
      logger.error(error)
      alert(error)
    }
  }

  const getCategories = async () => {
    try {
      const payload: MasterSelectPayloadType<CategoryType> = {
        table: "categories",
        column: ["ID", "description", "sequence", "imgPath", "status"],
      }

      const response = (await fetchMasterSelect(payload)) as CategoryType[]
      response.sort((a, b) => a.sequence - b.sequence)
      setCategories(response)
    } catch (error) {
      alert(error)
      logger.error(error)
    }
  }

  const initialize = () => {
    Promise.all([
      getTodayExpenses(),
      getPreviousExpenses(),
      getCategories(),
      getMonthlyExpenses(),
      getBudgetWallet(),
    ])
      .then(() => {
        logger.info("Resources loaded!")
      })
      .catch((error) => {
        logger.error(error)
        alert(error)
      })
  }

  useEffect(() => {
    if (!session) return undefined
    const response: TUsers | undefined = USERS.find(
      (u) => atob(u.email) === user && u.status === 1
    )

    if (response) {
      if (tabs.map(({ path }) => path).includes(pathname)) {
        const activeRoute = tabs.find((tab) => tab.path === pathname)
        setActiveTab(activeRoute || defaultTabInfo)
      }

      const isMaskSessionValue = localStorage.getItem("isMasked")
      let isMaskedValue = JSON.parse(isMaskSessionValue ?? "undefined") ?? true
      localStorage.setItem("isMasked", `${isMaskedValue}`)
      setIsMasked(isMaskedValue)
      initialize()
    } else {
      showAlert({ type: "error", message: "Unauthorized user!" })
      signOut()
      redirect("/login")
    }
  }, [])

  const handleUpdateExpense = async (
    newExpense: TodaysExpensesType,
    type: "add" | "edit"
  ) => {
    try {
      isTodayExpensePending.current = type === "add"

      let updatedExpenses: TodaysExpensesType[] | null = null
      let payload: SaveDataPayloadType = {
        table: "expenses",
        values: {
          amount: newExpense.amount,
          description: newExpense.description,
          categoryID: newExpense.categoryID,
          created_by: session?.user?.email,
          status: newExpense.status,
        },
      }

      if (type === "edit") {
        const payloadValues = { ...payload.values }
        updatedExpenses = todayExpenses?.map((expense) =>
          expense.ID === newExpense.ID
            ? {
                ...expense,
                ...payloadValues,
                category: newExpense.category,
              }
            : expense
        ) as TodaysExpensesType[]

        payload.key = {
          ID: newExpense.ID,
        }
      }

      const response = (await fetchSaveData(payload)) as SaveDataResponseType
      if (type === "add") {
        newExpense.ID = response.insertId
        const todayExpensesCopy = todayExpenses ? todayExpenses : []
        updatedExpenses = [
          newExpense,
          ...todayExpensesCopy,
        ] as TodaysExpensesType[]
      }
      setTodayExpenses(updatedExpenses!)
      initialize()
      isTodayExpensePending.current = false
    } catch (error) {
      logger.error(error)
      alert(error)
    }
  }

  const handleUpdateWalletBudget = async (
    newBudget: WalletBudgeType,
    type: "add" | "edit"
  ) => {
    try {
      isWalletBudgetPending.current = type === "add"

      let updatedWalletBudget: WalletBudgeType[] | null = null
      let payload: SaveDataPayloadType = {
        table: "wallet_budget",
        values: {
          title: newBudget.title,
          description: newBudget.description,
          amount: newBudget.amount,
          created_by: user,
        },
      }

      if (type === "edit") {
        const payloadValues = { ...payload.values }
        updatedWalletBudget = walletBudget?.map((budget) =>
          budget.ID === newBudget.ID
            ? {
                ...budget,
                ...payloadValues,
              }
            : budget
        ) as WalletBudgeType[]

        payload.key = {
          ID: newBudget.ID,
        }
      }

      const response = (await fetchSaveData(payload)) as SaveDataResponseType
      if (type === "add") {
        newBudget.ID = response.insertId
        const walletBudgetCopy = walletBudget ? walletBudget : []
        updatedWalletBudget = [
          newBudget,
          ...walletBudgetCopy,
        ] as WalletBudgeType[]
      }
      setWalletBudget(updatedWalletBudget!)
      isWalletBudgetPending.current = false
    } catch (error) {
      logger.error(error)
      alert(error)
    }
  }

  const value: ContextType = {
    tabs,
    activeTab,
    todayExpenses,
    previousExpenses,
    monthlyExpenses,
    walletBudget,
    categories,
    isMasked,
    isTodayExpensePending,
    isWalletBudgetPending,
    isLoadingState,
    monthlyExpensesBreakdown,
    setIsMasked,
    setActiveTab,
    handleUpdateExpense,
    handleUpdateWalletBudget,
    getPreviousExpenses,
    setMonthlyExpensesBreakdown,
  }

  return (
    <ComponentContext.Provider value={value}>
      {children}
    </ComponentContext.Provider>
  )
}

export const AppContext = () => {
  return useContext(ComponentContext)
}
