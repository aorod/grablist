import { useMemo } from 'react'
import { useListContext } from '@/store/listContext'

export function useList() {
  const { state, dispatch } = useListContext()

  const grandTotal = useMemo(() =>
    state.categories.reduce((total, cat) =>
      total + cat.subcategories.reduce((catTotal, sub) =>
        catTotal + sub.items.reduce((sum, item) =>
          sum + (item.qty || 0) * (item.unitPrice || 0), 0)
      , 0)
    , 0)
  , [state])

  const categoryTotal = (category) =>
    category.subcategories.reduce((total, sub) =>
      total + sub.items.reduce((sum, item) =>
        sum + (item.qty || 0) * (item.unitPrice || 0), 0)
    , 0)

  const addItem = (categoryId, subcategoryId, item) =>
    dispatch({ type: 'ADD_ITEM', categoryId, subcategoryId, item })

  const updateItem = (categoryId, subcategoryId, itemId, updates) =>
    dispatch({ type: 'UPDATE_ITEM', categoryId, subcategoryId, itemId, updates })

  const removeItem = (categoryId, subcategoryId, itemId) =>
    dispatch({ type: 'REMOVE_ITEM', categoryId, subcategoryId, itemId })

  const addCategory = (name, icon) =>
    dispatch({ type: 'ADD_CATEGORY', name, icon })

  const addSubcategory = (categoryId, name) =>
    dispatch({ type: 'ADD_SUBCATEGORY', categoryId, name })

  return {
    categories: state.categories,
    grandTotal,
    categoryTotal,
    addItem,
    updateItem,
    removeItem,
    addCategory,
    addSubcategory,
  }
}
