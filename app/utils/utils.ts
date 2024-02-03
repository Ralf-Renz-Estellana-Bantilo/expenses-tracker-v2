import moment from "moment"
import {
  FormattedPreviousExpensesType,
  PreviousExpensesType,
  TodaysExpensesType,
} from "../types/type"

export const CURRENT_YEAR = new Date().getFullYear()
export const CURRENT_MONTHID = new Date().getMonth() + 1

export const MONTHLIST = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const formatMoney = (money: string | number, isSecret?: boolean) => {
  const amount = Number(money).toFixed(2)
  const result = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })

  return isSecret ? `₱ ${maskNumber(`${amount}`)}` : `₱ ${result}`
}

export const formatDate = (date: string) => {
  return moment(date).format("l")
}

export const formatPreviousExpenses = (
  previousExpenses: PreviousExpensesType[]
): FormattedPreviousExpensesType[] => {
  previousExpenses.sort(function (a, b) {
    let dateA = `${new Date(a.created_on as string)}` as any
    let dateB = `${new Date(b.created_on as string)}` as any

    return dateB - dateA
  })

  const uniqueDate = [
    ...new Set(
      previousExpenses.map((exp) => formatDate(exp.created_on as string))
    ),
  ]

  const result = Array.from(uniqueDate, (date, index) => {
    const filterExpensesPerDate = previousExpenses.filter(
      (exp) => formatDate(exp.created_on as string) === formatDate(date)
    )
    let total = 0
    filterExpensesPerDate.forEach(({ amount }) => (total += Number(amount)))

    return {
      ID: index,
      date,
      total,
      expensesList: filterExpensesPerDate,
      monthID: filterExpensesPerDate[0]?.monthID ?? 0,
      year: filterExpensesPerDate[0]?.year ?? 0,
    }
  })

  return result
}

export const getCurrentMonth = (monthID = CURRENT_MONTHID): string => {
  return MONTHLIST[monthID - 1]
}

export const maskNumber = (money: string) => {
  try {
    const parts = money.split(".")
    if (parts.length === 2) {
      const integerPart = parts[0]
      const decimalPart = parts[1]
      const maskedInteger =
        "•".repeat(integerPart.length - 2) + integerPart.slice(-2)
      return `${maskedInteger}.${decimalPart}`
    } else {
      return money // No decimal part to mask
    }
  } catch (error) {
    return money
  }
}

export const getIcons = (ID?: number) => {
  let icons = [
    "food",
    "transportation",
    "communication",
    "insurance",
    "rent",
    "bill",
    "family",
    "clothes",
    "shopping",
    "purchase",
    "others",
  ]

  return ID ? icons[(ID - 1) % icons.length] : icons
}

export const getExpenseDescription = (
  created_on: string | undefined,
  description?: string | undefined,
  timeFormat?: string | undefined
) => {
  const timeStamp = `${moment(created_on ?? "").format(
    timeFormat ? timeFormat : "LT"
  )}`
  const shortDescription = `${`${description && `• ${description}`}`}`

  return [timeStamp, shortDescription].join(" ")
}

export const setRandomColor = (ID: number | string) => {
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#994D1C",
    "#B31312",
    "#C5E898",
    "#EBE3D5",
    "#87C4FF",
    "#00A9FF",
    "#F875AA",
    "#F9B572",
    "#DADDB1",
    "#F4CE14",
    "#DAFFFB",
    "#D988B9",
    "#79AC78",
    "#662549",
    "#FF9B82",
    "#A2C579",
    "#9A3B3B",
  ]

  return COLORS[(Number(ID) - 1) % COLORS.length]
}
