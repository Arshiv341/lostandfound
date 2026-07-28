import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportItem from './pages/ReportItem';
import ItemDetails from './pages/ItemDetails';
import ClaimsManager from './pages/ClaimsManager';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard layouts (Protected) */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="report" element={<ReportItem />} />
          <Route path="items/:id" element={<ItemDetails />} />
          <Route path="my-claims" element={<ClaimsManager />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
