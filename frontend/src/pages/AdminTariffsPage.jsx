import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Settings, Plus, CheckCircle, Info, Layers } from 'lucide-react';

export const AdminTariffsPage = () => {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form for new tariff
  const [name, setName] = useState('');
  const [fixedCharge, setFixedCharge] = useState(50);
  const [slabs, setSlabs] = useState([
    { fromUnit: 0, toUnit: 100, ratePerUnit: 2.0 },
    { fromUnit: 100, toUnit: 200, ratePerUnit: 3.0 },
    { fromUnit: 200, toUnit: 999999, ratePerUnit: 5.0 },
  ]);

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/tariffs');
      if (res.data.success) {
        setTariffs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlabChange = (idx, field, val) => {
    const updated = [...slabs];
    updated[idx][field] = parseFloat(val) || 0;
    setSlabs(updated);
  };

  const handleAddSlab = () => {
    const last = slabs[slabs.length - 1];
    setSlabs([...slabs, { fromUnit: last ? last.toUnit : 0, toUnit: (last ? last.toUnit : 0) + 100, ratePerUnit: 4.0 }]);
  };

  const handleCreateTariff = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/tariffs', {
        name,
        fixedCharge,
        slabs,
        active: true,
      });
      if (res.data.success) {
        setShowModal(false);
        fetchTariffs();
      }
    } catch (err) {
      alert('Failed to configure tariff schedule');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurable Electricity Tariffs</h1>
          <p className="text-sm text-slate-600">
            Define progressive consumption slabs and fixed service costs. Past bill calculations remain preserved.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm inline-flex items-center"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Define New Tariff Rate Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-slate-500">
            Loading tariffs...
          </div>
        ) : (
          tariffs.map((tariff) => (
            <div
              key={tariff.id}
              className={`p-6 rounded-2xl bg-white border ${
                tariff.active ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200'
              } shadow-sm space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{tariff.name}</h3>
                  <div className="text-xs text-slate-500">
                    Effective From: {tariff.effectiveFrom} {tariff.effectiveTo && `to ${tariff.effectiveTo}`}
                  </div>
                </div>
                {tariff.active ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Active Current Tariff
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                    Archived
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between">
                <span className="text-slate-600">Fixed Monthly Connection Charge:</span>
                <span className="font-bold text-slate-900">₹{tariff.fixedCharge}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Progressive Consumption Slabs
                </h4>
                <div className="space-y-2">
                  {tariff.slabs && tariff.slabs.map((slab, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-700">
                        {slab.toUnit >= 999999 || slab.toUnit <= 0
                          ? `Above ${slab.fromUnit} kWh`
                          : `${slab.fromUnit} - ${slab.toUnit} kWh`}
                      </span>
                      <span className="font-bold text-amber-700 font-mono">
                        ₹{slab.ratePerUnit?.toFixed(2)} / unit
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Tariff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateTariff} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">Define New Tariff Schedule</h3>
            <p className="text-xs text-slate-500">
              Activating this tariff will automatically apply it to all future bills while preserving historical invoices.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tariff Schedule Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. FY2026 Commercial & Residential Revision"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fixed Monthly Charge (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={fixedCharge}
                onChange={(e) => setFixedCharge(parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Tariff Slabs</label>
              {slabs.map((slab, idx) => (
                <div key={idx} className="flex gap-2 items-center text-xs">
                  <input
                    type="number"
                    value={slab.fromUnit}
                    onChange={(e) => handleSlabChange(idx, 'fromUnit', e.target.value)}
                    placeholder="From"
                    className="w-20 border rounded p-1.5"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={slab.toUnit}
                    onChange={(e) => handleSlabChange(idx, 'toUnit', e.target.value)}
                    placeholder="To"
                    className="w-24 border rounded p-1.5"
                  />
                  <span>kWh @ ₹</span>
                  <input
                    type="number"
                    step="0.1"
                    value={slab.ratePerUnit}
                    onChange={(e) => handleSlabChange(idx, 'ratePerUnit', e.target.value)}
                    placeholder="Rate"
                    className="w-20 border rounded p-1.5 font-bold"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSlab}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Tier
              </button>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm"
              >
                Save & Activate Tariff
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
