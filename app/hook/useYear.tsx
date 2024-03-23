import { CURRENT_YEAR } from "../utils/utils"

const useYear = () => {
  const MIN_YEAR = 2023
  const years = []
  for (let a = MIN_YEAR; a <= CURRENT_YEAR; a++) {
    years.push(a)
  }

  const yearList = Array.from(years, (year) => {
    return {
      ID: year,
      label: `${year}`,
      value: year,
    }
  })

  return yearList
}

export default useYear
