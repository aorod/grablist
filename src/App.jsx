import { Routes, Route } from 'react-router-dom'
import { ListProvider } from '@/store/listContext'
import { ListPage } from '@/pages/ListPage'
import { SavedListsPage } from '@/pages/SavedListsPage'

function App() {
  return (
    <ListProvider>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/saved" element={<SavedListsPage />} />
      </Routes>
    </ListProvider>
  )
}

export default App
