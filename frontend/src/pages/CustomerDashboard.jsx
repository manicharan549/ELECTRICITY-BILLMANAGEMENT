import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Zap,
  DollarSign,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const CustomerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customers/me/dashboard');
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error || 'Failed to fetch dashboard data.'}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    if (status === 'PAID') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle className="w-3.5 h-3.5 mr-1" /> PAID
        </span>
      );
    }
    if (status === 'OVERDUE') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
          <AlertCircle className="w-3.5 h-3.5 mr-1" /> OVERDUE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
        <Clock className="w-3.5 h-3.5 mr-1" /> UNPAID
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Welcome banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {stats.customerName}
          </h1>
          <p className="mt-1 text-slate-300 text-sm">
            Here is your current electricity consumption and billing summary.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl text-xs">
            <span className="text-slate-400 block">Meter Number</span>
            <span className="font-semibold text-amber-400 text-sm tracking-wide">{stats.meterNumber}</span>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl text-xs">
            <span className="text-slate-400 block">Connection Type</span>
            <span className="font-semibold text-slate-200 text-sm">{stats.meterType}</span>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Latest Consumption</span>
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.currentMonthConsumption.toLocaleString()} <span className="text-sm font-normal text-slate-500">kWh</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Recorded units for latest cycle</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Latest Bill Amount</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{stats.latestBillAmount?.toLocaleString() || '0.00'}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">Status:</span>
            {stats.latestBillStatus ? getStatusBadge(stats.latestBillStatus) : <span className="text-xs text-slate-400">None</span>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Next Due Date</span>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {stats.nextBillDueDate || 'N/A'}
          </div>
          <p className="mt-2 text-xs text-slate-500">Pay on time to prevent disconnection</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Outstanding</span>
            <TrendingUp className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            ₹{stats.totalOutstandingAmount?.toLocaleString() || '0.00'}
          </div>
          <p className="mt-2 text-xs text-slate-500">Pending total across all unpaid cycles</p>
        </div>
      </div>

      {/* Main Section: Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Electricity Consumption History</h2>
              <p className="text-xs text-slate-500">Units consumed per billing month (kWh)</p>
            </div>
          </div>
          {stats.monthlyConsumption && stats.monthlyConsumption.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyConsumption} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    formatter={(value) => [`${value} kWh`, 'Consumption']}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="units" fill="#d97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl">
              <Info className="w-8 h-8 mb-2" />
              <p className="text-sm">No billing records generated yet.</p>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {stats.latestBillId && (stats.latestBillStatus === 'UNPAID' || stats.latestBillStatus === 'OVERDUE') && (
                <Link
                  to={`/invoice/${stats.latestBillId}`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Pay Latest Bill Now
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <Link
                to="/bills"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" /> View All Bills
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/payments"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-slate-500" /> Payment History
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 bg-amber-50/50 p-4 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
              Need Assistance?
            </h3>
            <p className="text-xs text-amber-800">
              For faulty meters or supply interruptions, contact our 24/7 electrical emergency helpline at 1912.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bills Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Electricity Bills</h2>
          <Link to="/bills" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Bill Number</th>
                <th className="px-6 py-3">Month</th>
                <th className="px-6 py-3">Units (kWh)</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stats.recentBills && stats.recentBills.length > 0 ? (
                stats.recentBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{bill.billNumber}</td>
                    <td className="px-6 py-4">{bill.billingMonth}</td>
                    <td className="px-6 py-4">{bill.unitsConsumed}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">₹{bill.totalAmount}</td>
                    <td className="px-6 py-4">{bill.dueDate}</td>
                    <td className="px-6 py-4">{getStatusBadge(bill.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/invoice/${bill.id}`}
                        className="inline-flex items-center text-xs font-semibold text-amber-600 hover:text-amber-800"
                      >
                        View Invoice <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No bills generated yet for this account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
