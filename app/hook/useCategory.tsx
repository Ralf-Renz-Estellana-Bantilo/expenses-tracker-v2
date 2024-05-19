import { AppContext } from "../context/context"

const useCategory = () => {
  const context = AppContext()

  const { categories } = context

  const categoriesList = Array.from(categories ?? [], (category) => {
    return {
      ID: category.ID,
      label: category.description,
      value: category.ID,
      icon: category.imgPath,
    }
  })

  return categoriesList ?? []
}

export default useCategory
