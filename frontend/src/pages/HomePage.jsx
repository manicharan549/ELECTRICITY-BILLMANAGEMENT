import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, FileCheck, ArrowRight, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-6">
                <Zap className="w-4 h-4 fill-amber-600 text-amber-600" />
                Modern Energy Infrastructure & Billing
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Electricity Bill <span className="text-amber-600">Management</span> System
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                A seamless, automated platform designed for consumers and utility administrators. Track real-time consumption, calculate tiered slab bills, view invoices, and complete simulated instant payments.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {user ? (
                  <Link
                    to={user.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md transition-all"
                  >
                    Go to Your Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md transition-all"
                    >
                      Customer / Admin Login
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-300 shadow-sm transition-all"
                    >
                      New Customer Registration
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Accurate Slab Calculation</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Instant</div>
                  <div className="text-xs text-slate-500 font-medium">Simulated Payments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Secure</div>
                  <div className="text-xs text-slate-500 font-medium">JWT & Role Isolation</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-8 shadow-2xl text-white border border-slate-700">
                <div className="flex items-center justify-between pb-6 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">Standard Tiered Tariff</div>
                      <div className="text-xs text-slate-400">Illustrative Progressive Rates</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-medium">Active</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-200">First 100 units</div>
                      <div className="text-xs text-slate-400">Baseline residential consumption</div>
                    </div>
                    <div className="text-amber-400 font-bold text-lg">₹2.00 / unit</div>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-200">Next 100 units (101 - 200)</div>
                      <div className="text-xs text-slate-400">Standard usage tier</div>
                    </div>
                    <div className="text-amber-400 font-bold text-lg">₹3.00 / unit</div>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-200">Above 200 units</div>
                      <div className="text-xs text-slate-400">High consumption slab</div>
                    </div>
                    <div className="text-amber-400 font-bold text-lg">₹5.00 / unit</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Monthly Fixed Service Fee: ₹50.00</span>
                  <span>Calculated automatically</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Engineered for Reliability</h2>
          <p className="mt-3 text-slate-600">Built with Spring Boot 3, MongoDB Community Server, and React.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Consumption Analytics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time graphs powered by Recharts illustrating month-by-month power consumption and bill trends.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Itemized Invoices</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transparent bill breakdown showing meter readings, slab charges, fixed fees, and print-ready receipts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Role Isolation & Security</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Customers can only access their personal meters, bills, and payments. Administrative operations are locked with Spring Security.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          Electricity Bill Management System &copy; 2026. Built with React, Spring Boot 3, and MongoDB.
        </div>
      </footer>
    </div>
  );
};
