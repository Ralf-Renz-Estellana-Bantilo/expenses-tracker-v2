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

const fetchURL = async <T>(url: string, payload: unknown): Promise<T> => {
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

export const fetchPastWeekExpense = async <T>(payload: {
  user: string
}): Promise<T> => {
  return await fetchURL(URL_PASTWEEKEXPENSES, payload)
}

export const fetchMonthlyPercentageBreakdown = async <T>(payload: {
  user: string
  monthID: number
  year: number
}): Promise<T> => {
  return await fetchURL(URL_MONTHLYPERCENTAGEBREAKDOWN, payload)
}

export const fetchDailyExpenses = async <T>(payload: {
  user: string
}): Promise<T> => {
  return await fetchURL(URL_DAILYEXPENSES, payload)
}

export const fetchMonthlyExpenses = async <T>(payload: {
  user: string
}): Promise<T> => {
  return await fetchURL(URL_MONTHLYEXPENSES, payload)
}

export const fetchSummary = async <T>(payload: {
  user: string
}): Promise<T> => {
  return await fetchURL(URL_SUMMARY, payload)
}

export const fetchActionFilter = async <T>(payload: {
  user: string
  category: string
  month: string
  year: string
  sort: string
  order: string
}): Promise<T> => {
  return await fetchURL(URL_ACTIONFILTER, payload)
}
