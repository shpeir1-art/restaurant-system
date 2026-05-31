
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import TablePage from './pages/TablePage'
import WaiterPage from './pages/WaiterPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/table/:id" element={<TablePage />} />
      <Route path="/waiter" element={<WaiterPage />} />
    </Routes>
  </BrowserRouter>
)
