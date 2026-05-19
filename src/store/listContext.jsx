import { createContext, useContext, useReducer } from 'react'
import { catalog } from '@/data/catalog'

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

function buildInitialState() {
  return {
    categories: catalog.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      subcategories: cat.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        items: [],
      })),
    })),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { categoryId, subcategoryId, item } = action
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id !== categoryId ? cat : {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.id !== subcategoryId ? sub : {
                ...sub,
                items: [...sub.items, { ...item, id: uid() }],
              }
            ),
          }
        ),
      }
    }

    case 'UPDATE_ITEM': {
      const { categoryId, subcategoryId, itemId, updates } = action
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id !== categoryId ? cat : {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.id !== subcategoryId ? sub : {
                ...sub,
                items: sub.items.map(item =>
                  item.id !== itemId ? item : { ...item, ...updates }
                ),
              }
            ),
          }
        ),
      }
    }

    case 'REMOVE_ITEM': {
      const { categoryId, subcategoryId, itemId } = action
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id !== categoryId ? cat : {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.id !== subcategoryId ? sub : {
                ...sub,
                items: sub.items.filter(item => item.id !== itemId),
              }
            ),
          }
        ),
      }
    }

    case 'ADD_CATEGORY': {
      const { name, icon } = action
      return {
        ...state,
        categories: [
          ...state.categories,
          {
            id: uid(),
            name,
            icon: icon || '📦',
            subcategories: [{ id: uid(), name: 'Geral', items: [] }],
          },
        ],
      }
    }

    case 'ADD_SUBCATEGORY': {
      const { categoryId, name } = action
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id !== categoryId ? cat : {
            ...cat,
            subcategories: [...cat.subcategories, { id: uid(), name, items: [] }],
          }
        ),
      }
    }

    default:
      return state
  }
}

const ListContext = createContext(null)

export function ListProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, buildInitialState)
  return (
    <ListContext.Provider value={{ state, dispatch }}>
      {children}
    </ListContext.Provider>
  )
}

export function useListContext() {
  const ctx = useContext(ListContext)
  if (!ctx) throw new Error('useListContext precisa estar dentro de <ListProvider>')
  return ctx
}
