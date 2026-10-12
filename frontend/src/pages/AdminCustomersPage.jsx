import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Search, CheckCircle, XCircle, Plus, Zap, AlertCircle } from 'lucide-react';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigningMeterFor, setAssigningMeterFor] = useState(null);
  const [meterType, setMeterType] = useState('DOMESTIC');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [custRes, meterRes] = await Promise.all([
        api.get('/admin/customers'),
        api.get('/admin/meters')
      ]);
      if (custRes.data.success) setCustomers(custRes.data.data);
      if (meterRes.data.success) setMeters(meterRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomerStatus = async (customer) => {
    try {
      const res = await api.patch(`/admin/customers/${customer.id}/status`, {
        active: !customer.active,
      });
      if (res.data.success) {
        setCustomers(customers.map((c) => (c.id === customer.id ? res.data.data : c)));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAssignMeter = async () => {
    if (!assigningMeterFor) return;
    try {
      const res = await api.post('/admin/meters/assign', {
        customerId: assigningMeterFor.id,
        meterType: meterType,
      });
      if (res.data.success) {
        setAssigningMeterFor(null);
        loadData();
      }
    } catch (err) {
      alert('Failed to assign meter');
    }
  };

  const getCustomerMeters = (customerId) => {
    return meters.filter((m) => m.customerId === customerId);
  };

  const filtered = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-sm text-slate-600">
            View registered consumers, manage account activation states, and provision meters
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-sm text-slate-500">Loading customers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Email & Phone</th>
                  <th className="px-6 py-3.5">Service Address</th>
                  <th className="px-6 py-3.5">Assigned Meters</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((c) => {
                    const custMeters = getCustomerMeters(c.id);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                        <td className="px-6 py-4 text-xs">
                          <div>{c.email}</div>
                          <div className="text-slate-500">{c.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                          {c.address}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {custMeters.length > 0 ? (
                            custMeters.map((m) => (
                              <div key={m.id} className="font-mono font-medium text-blue-600 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> {m.meterNumber} ({m.meterType})
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-400">None assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {c.active ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800">
                              Suspended
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => setAssigningMeterFor(c)}
                            className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                          >
                            + Meter
                          </button>
                          <button
                            onClick={() => toggleCustomerStatus(c)}
                            className={`px-2.5 py-1 text-xs font-medium rounded border ${
                              c.active
                                ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                                : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {c.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No customer accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Meter Assignment Modal */}
      {assigningMeterFor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Provision New Electricity Meter</h3>
            <p className="text-xs text-slate-600">
              Assign a new electricity meter to customer: <strong>{assigningMeterFor.name}</strong>
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Meter Connection Category
              </label>
              <select
                value={meterType}
                onChange={(e) => setMeterType(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
              >
                <option value="DOMESTIC">DOMESTIC (Residential)</option>
                <option value="COMMERCIAL">COMMERCIAL (Retail / Office)</option>
                <option value="INDUSTRIAL">INDUSTRIAL (High Tension)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setAssigningMeterFor(null)}
                className="flex-1 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignMeter}
                className="flex-1 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm"
              >
                Assign Meter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
