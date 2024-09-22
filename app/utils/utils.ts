import moment from "moment"
import {
  FormattedPreviousExpensesType,
  PreviousExpensesType,
} from "../types/type"

interface FormatExpensesProps {
  previousExpenses: PreviousExpensesType[]
  monthID: number
  includesCurrentDay?: boolean
  sortOrder?: "DESC" | "ASC"
}

export const CURRENT_YEAR = new Date().getFullYear()
export const CURRENT_MONTHID = new Date().getMonth() + 1
export const CURRENT_DAY = new Date().getDate()

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

export const formatPreviousExpenses = ({
  previousExpenses,
  monthID,
  includesCurrentDay = false,
  sortOrder = "ASC",
}: FormatExpensesProps): FormattedPreviousExpensesType[] => {
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

  const numberOfDayInMonth = daysInMonth(CURRENT_YEAR, monthID)
  const elapsedDaysInMonth = includesCurrentDay ? CURRENT_DAY : CURRENT_DAY - 1

  const resultWithMissingDates = []

  for (let a = 1; a <= numberOfDayInMonth; a++) {
    const filteredDate = `${monthID}/${a}/${CURRENT_YEAR}`
    const filterResult = result.find((res) => res.date === filteredDate)

    const emptyResult = {
      ID: 111,
      date: filteredDate,
      total: 0,
      expensesList: [],
      monthID,
      year: CURRENT_YEAR,
    }

    if (CURRENT_MONTHID === monthID) {
      if (a <= elapsedDaysInMonth) {
        resultWithMissingDates.push(filterResult ?? emptyResult)
      }
    } else {
      resultWithMissingDates.push(filterResult ?? emptyResult)
    }
  }

  resultWithMissingDates.forEach((res, index) => (res.ID = index))

  if (sortOrder === "DESC") {
    resultWithMissingDates.sort(function (a, b) {
      return b.ID - a.ID
    })
  }

  return resultWithMissingDates
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

//random color base on category ID
export const setRandomColor = (ID: number | string) => {
  const COLORS = [
    "#00A9FF", // food
    "#52D3D8", // transportation
    "#C0D6E8", // communication
    "#C73659", // insurance
    "#41B06E", // rent
    "#AD88C6", // bill
    "#F38BA0", // family
    "#0B60B0", // clothes
    "#FFC94A", // shopping
    "#F2613F", // purchase
    "#FA7070", // healthcare
    "#C5E898", // others
    "#FFDC7F", // gadgets
  ]

  return COLORS[(Number(ID) - 1) % COLORS.length]
}

export const daysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate()
}
