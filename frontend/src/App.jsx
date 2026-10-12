import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CustomerBillsPage } from './pages/CustomerBillsPage';
import { PaymentHistoryPage } from './pages/PaymentHistoryPage';
import { InvoicePage } from './pages/InvoicePage';
import { ProfilePage } from './pages/ProfilePage';

import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCustomersPage } from './pages/AdminCustomersPage';
import { AdminGenerateBillPage } from './pages/AdminGenerateBillPage';
import { AdminBillsPage } from './pages/AdminBillsPage';
import { AdminTariffsPage } from './pages/AdminTariffsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Customer Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bills"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                    <CustomerBillsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                    <PaymentHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Shared Protected Route */}
              <Route
                path="/invoice/:id"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                    <InvoicePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminCustomersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/generate-bill"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminGenerateBillPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bills"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminBillsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tariffs"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminTariffsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
