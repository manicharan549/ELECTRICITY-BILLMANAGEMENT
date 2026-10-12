import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Zap,
  Printer,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Building,
  ShieldAlert,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paying, setPaying] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bills/${id}`);
      if (res.data && res.data.success) {
        setBill(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to retrieve bill invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSimulatePayment = async () => {
    setPaying(true);
    try {
      const res = await api.post('/customers/me/pay', {
        billId: bill.id,
        amount: bill.totalAmount,
        paymentMethod: paymentMethod,
        remarks: `Demonstration Payment via ${paymentMethod}`,
      });
      if (res.data && res.data.success) {
        setPaymentSuccessData(res.data.data);
        setShowPaymentModal(false);
        fetchBill();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment simulation failed.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error || 'Bill not found.'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Action buttons (hidden when printing) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to list
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
          >
            <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
          </button>

          {bill.status !== 'PAID' && user?.role === 'ROLE_CUSTOMER' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" /> Pay Bill Now (₹{bill.totalAmount})
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {paymentSuccessData && (
        <div className="print:hidden p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold">Payment Processed Successfully!</h4>
            <p className="text-xs mt-1">
              Transaction Reference: <span className="font-mono font-bold">{paymentSuccessData.transactionReference}</span>.
              This bill is now marked as PAID in the system.
            </p>
          </div>
        </div>
      )}

      {/* Printable Invoice Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-xl">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">POWERGRID UTILITY</h2>
              <p className="text-xs text-slate-500">Official Electricity Consumption Invoice</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-sm font-bold text-slate-900">{bill.billNumber}</div>
            <div className="text-xs text-slate-500">Issued: {bill.issueDate}</div>
            <div className="mt-2">
              {bill.status === 'PAID' ? (
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  PAID IN FULL
                </span>
              ) : bill.status === 'OVERDUE' ? (
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  PAYMENT OVERDUE
                </span>
              ) : (
                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  PAYMENT PENDING
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Customer and Billing Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Billed To</h3>
            <div className="text-base font-bold text-slate-800">{bill.customerName}</div>
            <div className="text-xs text-slate-600 mt-1">Consumer ID: {bill.customerId}</div>
            <div className="text-xs text-slate-600">Electricity Meter: <span className="font-semibold">{bill.meterNumber}</span></div>
          </div>

          <div className="sm:text-right">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Billing Period</h3>
            <div className="text-base font-bold text-slate-800">{bill.billingMonth}</div>
            <div className="text-xs text-slate-600 mt-1">Due Date: <span className="font-semibold text-rose-600">{bill.dueDate}</span></div>
            <div className="text-xs text-slate-500 mt-1">Tariff Schedule: {bill.tariffName || 'Standard Tiered'}</div>
          </div>
        </div>

        {/* Meter Consumption Breakdown */}
        <div className="py-6 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Meter Reading Details</h3>
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div>
              <div className="text-xs text-slate-500">Previous Reading</div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">{bill.previousReading} kWh</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Current Reading</div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">{bill.currentReading} kWh</div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <div className="text-xs text-amber-700 font-semibold">Total Consumed Units</div>
              <div className="text-lg font-black text-amber-600 mt-0.5">{bill.unitsConsumed} kWh</div>
            </div>
          </div>
        </div>

        {/* Itemized Progressive Slabs */}
        <div className="py-6 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Itemized Tariff Breakdown</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-xs">
                <th className="py-2">Tariff Tier Description</th>
                <th className="py-2 text-center">Units Charged</th>
                <th className="py-2 text-right">Rate / Unit</th>
                <th className="py-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bill.tariffBreakdown && bill.tariffBreakdown.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 font-medium">{item.slabDescription}</td>
                  <td className="py-2.5 text-center">{item.unitsCharged} kWh</td>
                  <td className="py-2.5 text-right font-mono">₹{item.ratePerUnit?.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-semibold">₹{item.slabTotal?.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="py-2.5 text-slate-600">Energy Charges Subtotal</td>
                <td className="py-2.5 text-right font-semibold text-slate-800">₹{bill.energyCharges?.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-2.5 text-slate-600">Fixed Monthly Connection & Meter Rent Charges</td>
                <td className="py-2.5 text-right font-semibold text-slate-800">₹{bill.fixedCharges?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="pt-6 flex justify-between items-center">
          <div className="text-xs text-slate-400 max-w-xs">
            * Please pay on or before the due date to avoid late payment surcharges. This is a computer-generated invoice.
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 font-semibold uppercase">Total Amount Payable</div>
            <div className="text-3xl font-black text-slate-900 mt-1">₹{bill.totalAmount}</div>
          </div>
        </div>
      </div>

      {/* Simulated Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Simulate Bill Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Demonstration Mode:</strong> No actual financial transaction will take place. No credit card or banking PINs are requested.
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Bill Payable:</span>
                <span className="text-xl font-black text-slate-900">₹{bill.totalAmount}</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'CARD', 'NET_BANKING'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        paymentMethod === method
                          ? 'border-amber-600 bg-amber-50 text-amber-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500">
                A unique verifiable transaction ID (e.g. <code>TXN-17...</code>) will be recorded in MongoDB and the bill status will be updated immediately.
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={paying}
                onClick={handleSimulatePayment}
                className="flex-1 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm disabled:opacity-50"
              >
                {paying ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
