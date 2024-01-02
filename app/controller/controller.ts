import axios from "axios"
import { MasterSelectPayloadType, SaveDataPayloadType } from "../types/type"

const URL_SAVEDATA = "/api/savedata"
const URL_MASTERSELECT = "/api/masterselect"
const URL_PASTWEEKEXPENSES = "/api/pastweekexpenses"
const URL_MONTHLYPERCENTAGEBREAKDOWN = "/api/monthlypercentagebreakdown"
const URL_DAILYEXPENSES = "/api/dailyexpenses"
const URL_MONTHLYEXPENSES = "/api/monthlyexpenses"
const URL_SUMMARY = "/api/summary"

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
  payload: MasterSelectPayloadType
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
