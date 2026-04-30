import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TableEditorPage from './pages/Admin/TableEditorPage';
import InventoryPage from './pages/Admin/InventoryPage';
import FinancePage from './pages/Admin/FinancePage';
import SuperAdminDashboard from './pages/Admin/SuperAdminDashboard';
import SearchPage from './pages/Public/SearchPage';
import RestaurantDetailPage from './pages/Public/RestaurantDetailPage';
import POSPage from './pages/Waiter/POSPage';
import KDSPage from './pages/Chef/KDSPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tables" element={<TableEditorPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/finance" element={<FinancePage />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/waiter/pos" element={<POSPage />} />
        <Route path="/chef/kds" element={<KDSPage />} />
      </Routes>
    </Router>
  )
}

export default App

