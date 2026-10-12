import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, Search, Filter, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const AdminBillsPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/bills');
      if (res.data && res.data.success) {
        setBills(res.data.data);
        setFilteredBills(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = bills;
    if (statusFilter !== 'ALL') {
      result = result.filter((b) => b.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.billNumber.toLowerCase().includes(term) ||
          b.customerName?.toLowerCase().includes(term) ||
          b.meterNumber?.toLowerCase().includes(term) ||
          b.billingMonth.toLowerCase().includes(term)
      );
    }
    setFilteredBills(result);
  }, [searchTerm, statusFilter, bills]);

  const getStatusBadge = (status) => {
    if (status === 'PAID') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle className="w-3 h-3 mr-1" /> PAID
        </span>
      );
    }
    if (status === 'OVERDUE') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800">
          <AlertCircle className="w-3 h-3 mr-1" /> OVERDUE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
        <Clock className="w-3 h-3 mr-1" /> UNPAID
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All System Bills</h1>
          <p className="text-sm text-slate-600">
            Audit generated bills across all consumer meters and inspect settlement status
          </p>
        </div>
        <Link
          to="/admin/generate-bill"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm"
        >
          + Generate Bill
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by Customer, Bill #, Meter #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-sm text-slate-500">Loading billing records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3.5">Bill Number</th>
                  <th className="px-6 py-3.5">Customer & Meter</th>
                  <th className="px-6 py-3.5">Month</th>
                  <th className="px-6 py-3.5">Readings</th>
                  <th className="px-6 py-3.5">Units (kWh)</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBills.length > 0 ? (
                  filteredBills.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{b.billNumber}</td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-semibold text-slate-800">{b.customerName}</div>
                        <div className="text-slate-500 font-mono">{b.meterNumber}</div>
                      </td>
                      <td className="px-6 py-4">{b.billingMonth}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">
                        {b.previousReading} → {b.currentReading}
                      </td>
                      <td className="px-6 py-4 font-medium">{b.unitsConsumed}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{b.totalAmount}</td>
                      <td className="px-6 py-4">{b.dueDate}</td>
                      <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/invoice/${b.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                      No bills match current query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
