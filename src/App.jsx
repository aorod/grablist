import { Routes, Route } from 'react-router-dom'
import { ListProvider } from '@/store/listContext'
import { ListPage } from '@/pages/ListPage'

function App() {
  return (
    <ListProvider>
      <Routes>
        <Route path="/" element={<ListPage />} />
      </Routes>
    </ListProvider>
  )
}

export default App
