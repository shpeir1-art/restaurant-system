
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import TablePage from './pages/TablePage'
import WaiterPage from './pages/WaiterPage'
import LoginPage from './pages/LoginPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/table/:id" element={<TablePage />} />

      <Route path="/waiter" element={<WaiterPage />} />

    </Routes>
  </BrowserRouter>
)