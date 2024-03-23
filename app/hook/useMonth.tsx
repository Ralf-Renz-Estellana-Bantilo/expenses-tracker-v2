import { MONTHLIST, getCurrentMonth } from "../utils/utils"

const useMonth = () => {
  const monthList = Array.from(MONTHLIST, (month, index) => {
    const monthID = index + 1
    const monthCode = getCurrentMonth(monthID).slice(0, 3).toUpperCase()
    return {
      ID: monthID,
      label: month,
      value: monthID,
      code: monthCode,
    }
  })

  return monthList
}

export default useMonth
