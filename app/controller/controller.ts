import axios from 'axios'
import {
    CategoryType,
    MonthlyExpensesType,
    PreviousExpensesType,
    SaveDataPayloadType,
    TodaysExpensesType,
    TUsers,
    WalletBudgeType,
} from '../types/type'
import {
    URL_ACTIONFILTER,
    URL_CATEGORIES,
    URL_DAILYEXPENSES,
    URL_EXPENSES_MONTH,
    URL_EXPENSES_MONTHLY_BREAKDOWN,
    URL_EXPENSES_TODAY,
    URL_MONTHLYEXPENSES,
    URL_MONTHLYPERCENTAGEBREAKDOWN,
    URL_PASTWEEKEXPENSES,
    URL_SAVEDATA,
    URL_SEARCH,
    URL_SUMMARY,
    URL_USER,
    URL_WALLET_BUDGET,
} from '../api/urls'

const postURL = async <T>(url: string, payload?: unknown): Promise<T> => {
    try {
        const result = await axios.post(url, payload)
        return result.data
    } catch (error) {
        throw error
    }
}

const patchURL = async <T>(url: string, payload?: T): Promise<T> => {
    try {
        const result = await axios.patch(url, payload)
        return result.data
    } catch (error) {
        throw error
    }
}

const getURL = async <T>(
    url: string,
    params?: Record<string, string | number | undefined>
): Promise<T> => {
    try {
        const result = await axios.get(url, { params })
        return result.data
    } catch (error) {
        throw error
    }
}

export const createData = async <T, K>(
    payload: SaveDataPayloadType<K>
): Promise<T> => {
    return await postURL(URL_SAVEDATA, payload)
}

export const updateData = async <T>(payload: T): Promise<T> => {
    return await patchURL(URL_SAVEDATA, payload)
}

export const fetchPastWeekExpense = async <T>(): Promise<T> => {
    return await postURL(URL_PASTWEEKEXPENSES)
}

export const fetchMonthlyPercentageBreakdown = async <T>(payload: {
    monthID: number
    year: number
}): Promise<T> => {
    return await postURL(URL_MONTHLYPERCENTAGEBREAKDOWN, payload)
}

export const fetchDailyExpenses = async <T>(): Promise<T> => {
    return await postURL(URL_DAILYEXPENSES)
}

export const fetchMonthlyExpenses = async <T>(): Promise<T> => {
    return await postURL(URL_MONTHLYEXPENSES)
}

export const fetchSummary = async <T>(): Promise<T> => {
    return await postURL(URL_SUMMARY)
}

export type TActionFilterPayload = {
    dateStart: string
    dateEnd: string
    category: string
    sort: string
    order: string
}
export const fetchActionFilter = async <T>(
    payload: TActionFilterPayload
): Promise<T> => {
    return await postURL(URL_ACTIONFILTER, payload)
}

export const fetchSearch = async <T>(payload: {
    searchText: string
}): Promise<T> => {
    return await postURL(URL_SEARCH, payload)
}

export const fetchUser = async (): Promise<TUsers[]> => {
    return await postURL(URL_USER)
}

export const fetchTodayExpenses = async (): Promise<TodaysExpensesType[]> => {
    return await getURL(URL_EXPENSES_TODAY)
}

export type FetchMonthExpensesParams = {
    monthID: number
    year: number
    sortBy?: 'created_on' | 'ID'
    sortDir?: 'ASC' | 'DESC'
}
export const fetchMonthExpenses = async (
    params: FetchMonthExpensesParams
): Promise<PreviousExpensesType[]> => {
    return await getURL(URL_EXPENSES_MONTH, params)
}

export const fetchMonthlyBreakdown = async (): Promise<
    MonthlyExpensesType[]
> => {
    return await getURL(URL_EXPENSES_MONTHLY_BREAKDOWN)
}

export const fetchWalletBudget = async (): Promise<WalletBudgeType[]> => {
    return await getURL(URL_WALLET_BUDGET)
}

export const fetchCategories = async (): Promise<CategoryType[]> => {
    return await getURL(URL_CATEGORIES)
}
