import axios from "axios"
import { MasterSelectPayload, SaveDataPayloadType } from "../types/type"
import {
  URL_ACTIONFILTER,
  URL_DAILYEXPENSES,
  URL_MASTERSELECT,
  URL_MONTHLYEXPENSES,
  URL_MONTHLYPERCENTAGEBREAKDOWN,
  URL_PASTWEEKEXPENSES,
  URL_SAVEDATA,
  URL_SUMMARY,
} from "../api/urls"

const fetchURL = async <T>(url: string, payload?: unknown): Promise<T> => {
  try {
    const result = await axios.post(url, payload)
    return result.data
  } catch (error) {
    throw error
  }
}

export const fetchSaveData = async <T>(
  payload: SaveDataPayloadType
): Promise<T> => {
  return await fetchURL(URL_SAVEDATA, payload)
}

export const fetchMasterSelect = async <T>(
  payload: MasterSelectPayload
): Promise<T> => {
  return await fetchURL(URL_MASTERSELECT, payload)
}

export const fetchPastWeekExpense = async <T>(): Promise<T> => {
  return await fetchURL(URL_PASTWEEKEXPENSES)
}

export const fetchMonthlyPercentageBreakdown = async <T>(payload: {
  monthID: number
  year: number
}): Promise<T> => {
  return await fetchURL(URL_MONTHLYPERCENTAGEBREAKDOWN, payload)
}

export const fetchDailyExpenses = async <T>(): Promise<T> => {
  return await fetchURL(URL_DAILYEXPENSES)
}

export const fetchMonthlyExpenses = async <T>(): Promise<T> => {
  return await fetchURL(URL_MONTHLYEXPENSES)
}

export const fetchSummary = async <T>(): Promise<T> => {
  return await fetchURL(URL_SUMMARY)
}

export const fetchActionFilter = async <T>(payload: {
  category: string
  month: string
  year: string
  sort: string
  order: string
}): Promise<T> => {
  return await fetchURL(URL_ACTIONFILTER, payload)
}
