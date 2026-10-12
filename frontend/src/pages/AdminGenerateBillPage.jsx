import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Zap, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminGenerateBillPage = () => {
  const navigate = useNavigate();
  const [meters, setMeters] = useState([]);
  const [loadingMeters, setLoadingMeters] = useState(true);

  const [formData, setFormData] = useState({
    meterId: '',
    billingMonth: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    previousReading: 0,
    currentReading: '',
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  });

  const [selectedMeter, setSelectedMeter] = useState(null);
  const [previewUnits, setPreviewUnits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successBill, setSuccessBill] = useState(null);

  useEffect(() => {
    api.get('/admin/meters')
      .then((res) => {
        if (res.data.success) {
          setMeters(res.data.data);
          if (res.data.data.length > 0) {
            handleMeterSelect(res.data.data[0]);
          }
        }
      })
      .finally(() => setLoadingMeters(false));
  }, []);

  const handleMeterSelect = (meter) => {
    setSelectedMeter(meter);
    setFormData((prev) => ({
      ...prev,
      meterId: meter.id,
      previousReading: meter.lastRecordedReading || 0,
    }));
  };

  const handleCurrentReadingChange = (val) => {
    const curr = parseFloat(val) || 0;
    setFormData((prev) => ({ ...prev, currentReading: val }));
    const prev = parseFloat(formData.previousReading) || 0;
    setPreviewUnits(curr >= prev ? Math.round((curr - prev) * 100) / 100 : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessBill(null);

    const prev = parseFloat(formData.previousReading);
    const curr = parseFloat(formData.currentReading);

    if (isNaN(curr) || curr < prev) {
      setError(`Current reading (${curr}) must be greater than or equal to previous reading (${prev}).`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/bills/generate', {
        meterId: formData.meterId,
        billingMonth: formData.billingMonth,
        previousReading: prev,
        currentReading: curr,
        dueDate: formData.dueDate,
      });

      if (res.data.success) {
        setSuccessBill(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Bill generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Generate Electricity Bill</h1>
        <p className="text-sm text-slate-600">
          Enter monthly meter readings to calculate tiered electricity tariff charges automatically
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {successBill && (
        <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-lg">Bill Generated Successfully!</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-emerald-600 block">Bill Number</span>
              <span className="font-bold font-mono text-sm">{successBill.billNumber}</span>
            </div>
            <div>
              <span className="text-emerald-600 block">Units Consumed</span>
              <span className="font-bold text-sm">{successBill.unitsConsumed} kWh</span>
            </div>
            <div>
              <span className="text-emerald-600 block">Total Amount</span>
              <span className="font-bold text-sm">₹{successBill.totalAmount}</span>
            </div>
            <div>
              <span className="text-emerald-600 block">Due Date</span>
              <span className="font-bold text-sm">{successBill.dueDate}</span>
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => navigate(`/invoice/${successBill.id}`)}
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800"
            >
              View Generated Invoice
            </button>
            <button
              onClick={() => setSuccessBill(null)}
              className="px-4 py-2 border border-emerald-300 text-emerald-800 rounded-lg text-sm font-medium hover:bg-emerald-100"
            >
              Generate Another
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Select Consumer Electricity Meter *
          </label>
          {loadingMeters ? (
            <div className="text-xs text-slate-500">Loading active meters...</div>
          ) : (
            <select
              value={formData.meterId}
              onChange={(e) => {
                const m = meters.find((x) => x.id === e.target.value);
                if (m) handleMeterSelect(m);
              }}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {meters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.meterNumber} ({m.meterType}) - Last Reading: {m.lastRecordedReading} kWh
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Billing Month *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 2026-10"
              value={formData.billingMonth}
              onChange={(e) => setFormData({ ...formData, billingMonth: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Previous Meter Reading (kWh) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.previousReading}
              onChange={(e) => {
                setFormData({ ...formData, previousReading: e.target.value });
                const prev = parseFloat(e.target.value) || 0;
                const curr = parseFloat(formData.currentReading) || 0;
                setPreviewUnits(curr >= prev ? Math.round((curr - prev) * 100) / 100 : 0);
              }}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">Retrieved from last recorded reading or physical audit</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Current Meter Reading (kWh) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 1430"
              value={formData.currentReading}
              onChange={(e) => handleCurrentReadingChange(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">Must be ≥ previous reading</p>
          </div>
        </div>

        {/* Live Calculation Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Estimated Units to be Billed</div>
              <div className="text-lg font-bold text-slate-900">{previewUnits} kWh</div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            Backend will apply tiered slabs: <br />
            0-100 @ ₹2, 101-200 @ ₹3, Above 200 @ ₹5
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || previewUnits < 0}
            className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {loading ? 'Calculating & Saving...' : 'Generate and Issue Bill'}
          </button>
        </div>
      </form>
    </div>
  );
};
