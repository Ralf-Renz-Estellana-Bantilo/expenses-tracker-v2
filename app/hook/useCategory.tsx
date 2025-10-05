import { AppContext } from '../context/context'

const useCategory = () => {
    const context = AppContext()
    const { categories } = context

    const categoriesList = Array.from(categories ?? [], (category) => {
        return {
            ID: category.ID,
            sequence: category.sequence,
            label: category.description,
            value: category.ID,
            icon: category.imgPath,
        }
    })

    categoriesList.sort((a, b) => a.sequence - b.sequence)

    return categoriesList ?? []
}

export default useCategory
