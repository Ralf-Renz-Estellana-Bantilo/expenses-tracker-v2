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
  DashboardSummaryType,
  ExpensesType,
  MasterSelectPayloadType,
  MonthlyExpensesType,
  PreviousExpensesType,
  SaveDataPayloadType,
  SaveDataResponseType,
  TabType,
  TodaysExpensesType,
  WalletBudgeType,
} from "../types/type"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  fetchMasterSelect,
  fetchSaveData,
  fetchSummary,
} from "../controller/controller"
import { formatPreviousExpenses, getIcons } from "../utils/utils"

export const ComponentContext = createContext<ContextType | null>(null)

type ExpensesDataType = ExpensesType & { category: string }

export default function ComponentContextProvider({
  children,
}: {
  children: ReactNode
}) {
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
  const [todayExpenses, setTodayExpenses] = useState<ExpensesDataType[] | null>(
    null
  )
  const [previousExpenses, setPreviousExpenses] = useState<
    PreviousExpensesType[] | null
  >(null)
  const [monthlyExpenses, setMonthlyExpenses] = useState<
    MonthlyExpensesType[] | null
  >(null)
  const [walletBudget, setWalletBudget] = useState<WalletBudgeType[] | null>(
    null
  )
  const [summary, setSummary] = useState<DashboardSummaryType | null>(null)

  const isTodayExpensePending = useRef(false)
  const isWalletBudgetPending = useRef(false)

  const [isMasked, setIsMasked] = useState(true)

  const [categories, setCategories] = useState<CategoryType[] | null>(null)

  const getTodayExpenses = async () => {
    try {
      const payload: MasterSelectPayloadType = {
        table: "today_expenses_view",
        filter: { created_by: user },
        sort: {
          ID: "DESC",
        },
      }
      const response = (await fetchMasterSelect(payload)) as ExpensesDataType[]
      setTodayExpenses(response)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  const getPreviousExpenses = async () => {
    try {
      const payload: MasterSelectPayloadType = {
        table: "previous_expenses_view",
        filter: { created_by: user },
        sort: {
          ID: "DESC",
        },
      }
      const response = (await fetchMasterSelect(payload)) as ExpensesDataType[]
      const result = formatPreviousExpenses(response)
      setPreviousExpenses(result)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  const getMonthlyExpenses = async () => {
    try {
      const payload: MasterSelectPayloadType = {
        table: "monthly_expenses_view",
        filter: { user },
        sort: { monthID: "DESC" },
      }
      const response = (await fetchMasterSelect(
        payload
      )) as MonthlyExpensesType[]
      setMonthlyExpenses(response)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  const getBudgetWallet = async () => {
    try {
      const payload: MasterSelectPayloadType = {
        table: "wallet_budget",
        filter: {
          created_by: user,
        },
        sort: {
          ID: "DESC",
        },
      }
      const response = (await fetchMasterSelect(payload)) as WalletBudgeType[]
      setWalletBudget(response)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  const getSummary = async () => {
    try {
      const response = (await fetchSummary({ user })) as DashboardSummaryType[]
      setSummary(response[0] ?? null)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  const getCategories = async () => {
    try {
      const payload: MasterSelectPayloadType = {
        table: "categories",
        column: "ID, description, status",
      }

      const response = (await fetchMasterSelect(payload)) as CategoryType[]

      const categorylist = Array.from(response, (category) => {
        return {
          ...category,
          imgPath: getIcons(category.ID) as string,
        }
      })
      setCategories(categorylist)
    } catch (error) {
      alert(error)
      console.log(error)
    }
  }

  useEffect(() => {
    if (session) {
      if (tabs.map(({ path }) => path).includes(pathname)) {
        const activeRoute = tabs.find((tab) => tab.path === pathname)
        setActiveTab(activeRoute || defaultTabInfo)
      }

      const isMaskSessionValue = localStorage.getItem("isMasked")
      let isMaskedValue = isMaskSessionValue === "true" ?? true
      localStorage.setItem("isMasked", `${isMaskedValue}`)
      setIsMasked(isMaskedValue)
      Promise.all([
        getTodayExpenses(),
        getPreviousExpenses(),
        getCategories(),
        getMonthlyExpenses(),
        getBudgetWallet(),
      ])
        .then(() => {
          console.log("Resources loaded!")
        })
        .catch((error) => {
          console.error(error)
          alert(error)
        })
    }
  }, [])

  const handleUpdateExpense = async (
    newExpense: TodaysExpensesType,
    type: "add" | "edit"
  ) => {
    try {
      isTodayExpensePending.current = type === "add"

      let updatedExpenses: ExpensesDataType[] | null = null
      let payload: SaveDataPayloadType = {
        table: "expenses",
        values: {
          amount: newExpense.amount,
          description: newExpense.description,
          categoryID: newExpense.categoryID,
          created_by: session?.user?.email,
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
        ) as ExpensesDataType[]

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
        ] as ExpensesDataType[]
      }
      setTodayExpenses(updatedExpenses!)
      await getMonthlyExpenses()
      isTodayExpensePending.current = false
    } catch (error) {
      console.log(error)
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
      console.log(error)
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
    summary,
    setIsMasked,
    setActiveTab,
    handleUpdateExpense,
    handleUpdateWalletBudget,
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
