import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';
import api from '../api/axios';
import { MdMail, MdLock } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(String(error));
    }
  }, [error]);

  // Validation helpers
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!emailRegex.test(value)) return 'Enter a valid email';
        return '';
      case 'password':
        if (!value.trim()) return 'Password is required';
        return '';
      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const msg = validateField(key, form[key]);
      if (msg) newErrors[key] = msg;
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    if (touched[name]) {
      const msg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const msg = validateField(name, form[name]);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateAll();
    if (Object.keys(newErrors).length > 0) {
      const allTouched = {};
      Object.keys(form).forEach((k) => (allTouched[k] = true));
      setTouched(allTouched);
      toast.error('Please fix the errors in the form');
      return;
    }

    const action = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(action)) {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
      }
      navigate('/dashboard');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-900 p-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-700/30 to-cyan-700/20 blur-3xl transform rotate-12" />
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-2xl bg-gradient-to-bl from-rose-800/20 to-yellow-700/10 blur-2xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
              <p className="text-sm text-slate-300 mt-1">Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-xs text-slate-300/80">Email</span>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <MdMail className="w-5 h-5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@company.com"
                    className={`pl-11 pr-3 py-2 w-full rounded-lg bg-slate-800/60 border ${
                      errors.email && touched.email ? 'border-rose-500' : 'border-slate-700'
                    } text-slate-100 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition`}
                  />
                </div>
                {errors.email && touched.email && <div className="text-rose-400 text-xs mt-1">{errors.email}</div>}
              </label>

              <label className="block">
                <span className="text-xs text-slate-300/80">Password</span>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <MdLock className="w-5 h-5" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your password"
                    className={`pl-11 pr-3 py-2 w-full rounded-lg bg-slate-800/60 border ${
                      errors.password && touched.password ? 'border-rose-500' : 'border-slate-700'
                    } text-slate-100 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-40 transition`}
                  />
                </div>
                {errors.password && touched.password && <div className="text-rose-400 text-xs mt-1">{errors.password}</div>}
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 font-medium hover:text-cyan-300 transition">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
