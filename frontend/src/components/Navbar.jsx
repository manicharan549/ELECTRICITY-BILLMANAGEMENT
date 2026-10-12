import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  LayoutDashboard,
  FileText,
  CreditCard,
  User,
  LogOut,
  Users,
  Settings,
  ShieldCheck,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-lg text-white shadow-sm">
                <Zap className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl text-slate-850 tracking-tight">
                Power<span className="text-amber-600">Grid</span> Billing
              </span>
            </Link>

            {user && (
              <nav className="hidden md:flex ml-10 space-x-1">
                {user.role === 'ROLE_CUSTOMER' ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/dashboard') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                    <Link
                      to="/bills"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/bills') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <FileText className="w-4 h-4 mr-2" /> My Bills
                    </Link>
                    <Link
                      to="/payments"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/payments') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mr-2" /> Payment History
                    </Link>
                    <Link
                      to="/profile"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/profile') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-4 h-4 mr-2" /> Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/admin"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Admin Overview
                    </Link>
                    <Link
                      to="/admin/customers"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/admin/customers') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-4 h-4 mr-2" /> Customers
                    </Link>
                    <Link
                      to="/admin/generate-bill"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/admin/generate-bill') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" /> Generate Bill
                    </Link>
                    <Link
                      to="/admin/bills"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/admin/bills') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <FileText className="w-4 h-4 mr-2" /> All Bills
                    </Link>
                    <Link
                      to="/admin/tariffs"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/admin/tariffs') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Settings className="w-4 h-4 mr-2" /> Tariff Settings
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
                    {user.role === 'ROLE_ADMIN' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Admin
                      </span>
                    ) : (
                      <span className="text-slate-500">Meter: {user.meterNumber || 'Pending'}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
                >
                  Register Customer
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 px-4 pt-2 pb-4 space-y-1 bg-white">
          {user ? (
            <>
              <div className="py-2 border-b border-slate-100 mb-2">
                <div className="font-semibold text-slate-800">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
              {user.role === 'ROLE_CUSTOMER' ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Dashboard</Link>
                  <Link to="/bills" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">My Bills</Link>
                  <Link to="/payments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Payment History</Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Admin Overview</Link>
                  <Link to="/admin/customers" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Customers</Link>
                  <Link to="/admin/generate-bill" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Generate Bill</Link>
                  <Link to="/admin/bills" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">All Bills</Link>
                  <Link to="/admin/tariffs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Tariff Settings</Link>
                </>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 text-rose-600 font-medium hover:bg-rose-50 rounded-md"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-2 text-slate-700 border border-slate-300 rounded-md">Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-2 bg-amber-600 text-white rounded-md">Register Customer</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
