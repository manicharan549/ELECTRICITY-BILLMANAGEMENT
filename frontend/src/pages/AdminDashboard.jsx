import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Users,
  FileText,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Settings,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError('Unable to load admin analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error || 'Failed to load admin dashboard.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-400">Control Panel</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">Utility Administration & Operations</h1>
          <p className="text-sm text-slate-300 mt-1">Live overview of consumers, billing generation, and revenue collection</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/generate-bill"
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Generate New Bill
          </Link>
          <Link
            to="/admin/tariffs"
            className="inline-flex items-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" /> Tariff Config
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Consumers</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalCustomers}</div>
          <div className="mt-2 text-xs text-emerald-600 font-medium">
            {stats.activeCustomers} Active accounts
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Bills Issued</span>
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalBills}</div>
          <div className="mt-2 text-xs text-slate-500">
            {stats.paidBills} Paid &bull; {stats.unpaidBills} Unpaid
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Bills</span>
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">{stats.overdueBills}</div>
          <div className="mt-2 text-xs text-rose-500">Past payment due deadline</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue Collected</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">
            ₹{stats.totalRevenueCollected?.toLocaleString() || '0.00'}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across {stats.totalRecordedPayments} settled payments
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1">Monthly Revenue Collection (₹)</h2>
          <p className="text-xs text-slate-500 mb-6">Aggregated from successful paid invoices</p>
          <div className="h-64">
            {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    formatter={(val) => [`₹${val}`, 'Revenue']}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No revenue records recorded yet
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1">Grid Electricity Consumption (kWh)</h2>
          <p className="text-xs text-slate-500 mb-6">Total monthly power usage across all registered meters</p>
          <div className="h-64">
            {stats.monthlyConsumption && stats.monthlyConsumption.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyConsumption}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    formatter={(val) => [`${val} kWh`, 'Units Consumed']}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="units" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No consumption records recorded yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/customers"
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900">Manage Customers</h3>
            <p className="text-xs text-slate-500 mt-1">View list, deactivate/reactivate, assign meters</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </Link>

        <Link
          to="/admin/generate-bill"
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900">Generate Electricity Bill</h3>
            <p className="text-xs text-slate-500 mt-1">Submit meter readings and apply tiered tariff calculation</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </Link>

        <Link
          to="/admin/tariffs"
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900">Configure Tariff Rates</h3>
            <p className="text-xs text-slate-500 mt-1">Adjust progressive slabs and fixed monthly fees</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </Link>
      </div>
    </div>
  );
};
