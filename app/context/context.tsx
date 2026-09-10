import { signOut, useSession } from 'next-auth/react'
import { redirect, usePathname } from 'next/navigation'
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { USERS } from '../api/users/users_db'
import {
    fetchCategories,
    fetchMonthExpenses,
    fetchMonthlyBreakdown,
    createData,
    fetchTodayExpenses,
    fetchWalletBudget,
} from '../controller/controller'
import { getColorThemeById } from '../database/colorThemeTable'
import useAlert from '../hook/useAlert'
import { DashboardIcon, ProfileIcon, SettingsIcon } from '../icons/icons'
import {
    CategoryType,
    ContextType,
    FormattedPreviousExpensesType,
    MonthlyExpensesBreakdownType,
    MonthlyExpensesType,
    SaveDataPayloadType,
    SaveDataResponseType,
    TabType,
    TodaysExpensesType,
    TUsers,
    WalletBudgeType,
} from '../types/type'
import { getCookie } from '../utils/helper'
import { CustomLogger, LogLevel } from '../utils/logger'
import {
    CURRENT_MONTHID,
    CURRENT_YEAR,
    formatPreviousExpenses,
    MONTHLIST,
} from '../utils/utils'

export const ComponentContext = createContext<ContextType>(null as any)

export default function ComponentContextProvider({
    children,
}: {
    children: ReactNode
}) {
    const logger = new CustomLogger(LogLevel.ERROR)
    const { showAlert } = useAlert()

    const { data: session } = useSession()
    const user = session?.user?.email ?? 'unknown@user.com'

    const pathname = usePathname()

    const [selectedColor, setSelectedColor] = useState(getColorThemeById(1))

    const [tabs] = useState<TabType[]>([
        {
            ID: 1,
            description: 'Dashboard',
            path: '/dashboard',
            icon: <DashboardIcon />,
        },
        {
            ID: 2,
            description: 'Profile',
            path: '/profile',
            icon: <ProfileIcon />,
        },
        {
            ID: 3,
            description: 'Settings',
            path: '/settings',
            icon: <SettingsIcon />,
        },
    ])
    const defaultTabInfo: TabType = {
        ...tabs[0],
        description: 'Expenses Tracker',
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
    const [isMasked, setIsMasked] = useState(true)
    const [categories, setCategories] = useState<CategoryType[] | null>(null)
    const [mode, setMode] = useState<string>('')

    const isTodayExpensePending = useRef(false)
    const isWalletBudgetPending = useRef(false)
    const isLoadingState = useRef(false)

    const getTodayExpenses = async () => {
        try {
            const response = await fetchTodayExpenses()
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
            const response = await fetchMonthExpenses({
                monthID,
                year: CURRENT_YEAR,
                sortBy: 'created_on',
                sortDir: 'DESC',
            })

            const result = formatPreviousExpenses({
                previousExpenses: response,
                monthID,
                sortOrder: 'DESC',
            })

            setPreviousExpenses(result)
        } catch (error) {
            logger.error(error)
            alert(error)
        }
    }

    const getMonthlyExpenses = async () => {
        try {
            const response = await fetchMonthlyBreakdown()

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
            const response = await fetchWalletBudget()
            setWalletBudget(response)
        } catch (error) {
            logger.error(error)
            alert(error)
        }
    }

    const getCategories = async () => {
        try {
            const response = await fetchCategories()
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
                logger.info('Resources loaded!')
            })
            .catch((error) => {
                logger.error(error)
                alert(error)
            })
    }

    useEffect(() => {
        if (!session) return undefined

        const modeFromCookie = getCookie<string>('mode', '')
        if (Boolean(modeFromCookie)) {
            setMode(modeFromCookie)
        }

        const colorThemeID = getCookie<number>('colorThemeID', 1)
        setSelectedColor(getColorThemeById(colorThemeID))

        const response: TUsers | undefined = USERS.find(
            (u) => atob(u.email) === user && u.status === 1
        )

        if (response) {
            if (tabs.map(({ path }) => path).includes(pathname)) {
                const activeRoute = tabs.find((tab) => tab.path === pathname)
                setActiveTab(activeRoute || defaultTabInfo)
            }

            const isMaskSessionValue = localStorage.getItem('isMasked')
            let isMaskedValue = isMaskSessionValue
                ? JSON.parse(isMaskSessionValue)
                : false
            localStorage.setItem('isMasked', `${isMaskedValue}`)
            setIsMasked(isMaskedValue)
            initialize()
        } else {
            showAlert({ type: 'error', message: 'Unauthorized user!' })
            signOut()
            redirect('/login')
        }
    }, [])

    const handleUpdateExpense = async (
        newExpense: TodaysExpensesType,
        type: 'add' | 'edit'
    ) => {
        try {
            isTodayExpensePending.current = type === 'add'

            let updatedExpenses: TodaysExpensesType[] | null = null
            let payload: SaveDataPayloadType<TodaysExpensesType> = {
                table: 'expenses',
                values: {
                    amount: newExpense.amount,
                    description: newExpense.description,
                    categoryID: newExpense.categoryID,
                    created_by: session?.user?.email ?? '',
                    status: newExpense.status,
                },
            }

            if (type === 'edit') {
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

            const response = await createData<
                SaveDataResponseType,
                TodaysExpensesType
            >(payload)
            if (type === 'add') {
                newExpense.ID = response.insertId
                const todayExpensesCopy = todayExpenses ? todayExpenses : []
                updatedExpenses = [
                    newExpense,
                    ...todayExpensesCopy,
                ] as TodaysExpensesType[]
            }
            setTodayExpenses(updatedExpenses!)

            Promise.all([getTodayExpenses(), getMonthlyExpenses()])
                .then(() => {
                    isTodayExpensePending.current = false
                })
                .catch((error) => {
                    logger.error(error)
                    alert(error)
                })
        } catch (error) {
            logger.error(error)
            alert(error)
        }
    }

    const handleUpdateWalletBudget = async (
        newBudget: WalletBudgeType,
        type: 'add' | 'edit'
    ) => {
        try {
            isWalletBudgetPending.current = type === 'add'

            let updatedWalletBudget: WalletBudgeType[] | null = null
            let payload: SaveDataPayloadType<WalletBudgeType> = {
                table: 'wallet_budget',
                values: {
                    title: newBudget.title,
                    description: newBudget.description,
                    amount: newBudget.amount,
                    status: newBudget.status ?? 1,
                    created_by: user,
                },
            }

            if (type === 'edit') {
                const payloadValues = { ...payload.values }
                updatedWalletBudget = walletBudget
                    ?.map((budget) =>
                        budget.ID === newBudget.ID
                            ? {
                                  ...budget,
                                  ...payloadValues,
                              }
                            : budget
                    )
                    .filter((w) => w.status === 1) as WalletBudgeType[]

                payload.key = {
                    ID: newBudget.ID,
                }
            }

            const response = (await createData(payload)) as WalletBudgeType[]

            if (type === 'add') {
                newBudget.ID = response[0].ID
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
        selectedColor,
        mode,
        setMode,
        setIsMasked,
        setActiveTab,
        handleUpdateExpense,
        handleUpdateWalletBudget,
        getPreviousExpenses,
        setMonthlyExpensesBreakdown,
        setSelectedColor,
    }

    return (
        <ComponentContext.Provider value={value}>
            {children}
        </ComponentContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(ComponentContext)

    if (!context) {
        throw new Error('Context error!')
    }

    return context
}
