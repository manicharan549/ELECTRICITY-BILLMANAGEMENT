import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Zap, User, Mail, Phone, MapPin, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email address format required';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.address.trim()) errs.address = 'Service installation address is required';
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      if (response.data && response.data.success) {
        login(response.data.data);
        navigate('/dashboard');
      } else {
        setServerError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.data) {
        setErrors(err.response.data.data);
      } else if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Server error during registration. Ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-sm">
            <Zap className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
            Register Customer Account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Create an account to monitor consumption, receive itemized bills, and make payments
          </p>
        </div>

        {serverError && (
          <div className="rounded-lg bg-rose-50 p-4 border border-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            <div className="text-sm text-rose-700">{serverError}</div>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-amber-500'} rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-amber-500'} rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-amber-500'} rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Installation Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none text-slate-400">
                <MapPin className="h-5 w-5" />
              </div>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="House #12, Phase 3, Green Park, New Delhi"
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.address ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-amber-500'} rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.password ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-amber-500'} rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.confirmPassword ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-amber-500'} rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating Account & Meter...' : 'Complete Registration'}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-amber-600 hover:text-amber-700">
            Sign in to existing account
          </Link>
        </div>
      </div>
    </div>
  );
};
