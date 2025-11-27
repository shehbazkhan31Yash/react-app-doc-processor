import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, clearError, clearRegisterMessage } from '../store/slices/authSlice';
import { MdPerson, MdMail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, registerMessage } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', 
  });

  const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});
const [showPassword, setShowPassword] = useState(false);  
const [showConfirmPassword, setShowConfirmPassword] = useState(false);  


  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearRegisterMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    if (registerMessage) {
      toast.success(String(registerMessage));
      setTimeout(() => navigate('/login'), 700);
    }
  }, [registerMessage, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(String(error));
    }
  }, [error]);

 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userNameRegex = /^[A-Za-z][A-Za-z0-9_]*$/; 
  const nameRegex = /^[A-Za-z][A-Za-z'-]*$/; 

  const validateField = (name, value) => {
    switch (name) {
      case 'userName':
        if (!value || !value.trim()) return 'Username is required';
        if (value.trim().length < 3) return 'Username must be at least 3 characters';
        if (!userNameRegex.test(value.trim())) return 'Username must start with a letter and may contain letters, digits or underscores';
        return '';
      case 'firstName':
        if (!value || !value.trim()) return 'First name is required';
        if (!nameRegex.test(value.trim())) return 'First name must start with a letter and only contain letters, hyphen or apostrophe';
        return '';
      case 'lastName':
        if (!value || !value.trim()) return 'Last name is required';
        if (!nameRegex.test(value.trim())) return 'Last name must start with a letter and only contain letters, hyphen or apostrophe';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email is required';
        if (!emailRegex.test(value)) return 'Enter a valid email';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) return 'Password must include letters and numbers';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== form.password) return 'Passwords do not match';
        return '';
      default:
        return '';
      case 'role':  
     if (!value) return 'Please select a role';
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

      if (name === 'password' && touched.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: validateField('confirmPassword', form.confirmPassword) }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const msg = validateField(name, form[name]);
    setErrors((prev) => ({ ...prev, [name]: msg }));
    if (name === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateField('confirmPassword', form.confirmPassword) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateAll();
    if (Object.keys(newErrors).length > 0) {
      const allTouched = {};
      Object.keys(form).forEach((k) => (allTouched[k] = true));
      setTouched(allTouched);
      toast.error('Please fix the errors in the form');
      return;
    }

    const payload = {
      userName: form.userName.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role, 
    };

    dispatch(registerUser(payload));
  };

  const passwordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (pw.length >= 12) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return Math.min(score, 5);
  };
  const strength = passwordStrength(form.password);
  const strengthColor =
    strength <= 1 ? 'bg-rose-500' : strength === 2 ? 'bg-amber-400' : strength === 3 ? 'bg-yellow-300' : strength === 4 ? 'bg-emerald-400' : 'bg-cyan-400';

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-rose-900 p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:flex flex-col items-start justify-center p-8 rounded-2xl bg-slate-800/30 border border-slate-700/30 shadow-2xl">
            <div className="mb-6">
              <h1 className="text-4xl font-extrabold text-white">Welcome</h1>
              <p className="mt-2 text-slate-300 max-w-sm">Create an account to get started. Secure, simple, and welcoming.</p>
            </div>

            <div className="w-full">
              <svg width="100%" height="220" viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#06b6d4" stopOpacity="0.12"/>
                    <stop offset="1" stopColor="#7c3aeb" stopOpacity="0.06"/>
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="600" height="220" rx="20" fill="url(#g1)"/>
                <g transform="translate(20,20)" opacity="0.9">
                  <circle cx="40" cy="40" r="28" fill="#fff" opacity="0.04"/>
                  <circle cx="520" cy="140" r="60" fill="#fff" opacity="0.03"/>
                  <rect x="60" y="80" width="120" height="60" rx="12" fill="#fff" opacity="0.02"/>
                </g>
              </svg>
            </div>

            <small className="text-xs text-slate-400 mt-6">We use industry-standard encryption and best practices to keep your account safe.</small>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Create account</h2>
                <p className="text-sm text-slate-300 mt-1">Join us and enjoy the experience.</p>
              </div>
              
            </div>

            {/* <div className="mb-4">
              {registerMessage && (
                <div className="p-3 rounded-lg bg-emerald-900/80 text-emerald-100 mb-3 transition-opacity duration-300">
                  {registerMessage}
                </div>
              )}
              {error && (
                <div className="p-3 rounded-lg bg-rose-900/80 text-rose-100 mb-3 transition-opacity duration-300">
                  {String(error)}
                </div>
              )}
            </div> */}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex flex-col">
                  <span className="text-xs text-slate-300 mb-1">Username</span>
                  <div className="relative">
                    <input
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. alex_99"
                      className={`w-full pl-4 pr-3 py-2 rounded-lg border ${errors.userName && touched.userName ? 'border-rose-500' : 'border-slate-700'} bg-slate-800/60 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                    />
                  </div>
                  {errors.userName && touched.userName && <div className="text-rose-400 text-xs mt-1">{errors.userName}</div>}
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-xs text-slate-300 mb-1">First name</span>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=" First"
                    className={`w-full pr-3 py-2 rounded-lg border ${errors.firstName && touched.firstName ? 'border-rose-500' : 'border-slate-700'} bg-slate-800/60 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                  />
                  {errors.firstName && touched.firstName && <div className="text-rose-400 text-xs mt-1">{errors.firstName}</div>}
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-slate-300 mb-1">Last name</span>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=" Last"
                    className={`w-full pr-3 py-2 rounded-lg border ${errors.lastName && touched.lastName ? 'border-rose-500' : 'border-slate-700'} bg-slate-800/60 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                  />
                  {errors.lastName && touched.lastName && <div className="text-rose-400 text-xs mt-1">{errors.lastName}</div>}
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <span className="text-xs text-slate-300 mb-1">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder=" you@company.com"
                    className={`w-full pr-3 py-2 rounded-lg border ${errors.email && touched.email ? 'border-rose-500' : 'border-slate-700'} bg-slate-800/60 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                  />
                  {errors.email && touched.email && <div className="text-rose-400 text-xs mt-1">{errors.email}</div>}
                </label>
              </div>

<div>
  <label className="flex flex-col">
    <span className="text-xs text-slate-300 mb-2">Select Role</span>
    <div className="flex gap-6">
      <div className="flex items-center">
        <input
          type="radio"
          id="role-user"
          name="role"
          value="user"
          checked={form.role === 'user'}
          onChange={handleChange}
          className="w-4 h-4 text-cyan-400 bg-slate-800/60 border-slate-700 focus:ring-2 focus:ring-cyan-400 cursor-pointer"
        />
        <label htmlFor="role-user" className="ml-2 text-sm text-slate-300 cursor-pointer">
          User
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id="role-manager"
          name="role"
          value="manager"
          checked={form.role === 'manager'}
          onChange={handleChange}
          className="w-4 h-4 text-cyan-400 bg-slate-800/60 border-slate-700 focus:ring-2 focus:ring-cyan-400 cursor-pointer"
        />
        <label htmlFor="role-manager" className="ml-2 text-sm text-slate-300 cursor-pointer">
          Manager
        </label>
      </div>
    </div>
    {errors.role && touched.role && <div className="text-rose-400 text-xs mt-1">{errors.role}</div>}
  </label>
</div>

              <div>
  <label className="flex flex-col">
    <span className="text-xs text-slate-300 mb-1">Password</span>
    <div className="relative">
      <input
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={form.password}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder=" Create a password"
        className={`w-full pr-10 py-2 rounded-lg border ${errors.password && touched.password ? 'border-rose-500' : 'border-slate-700'} bg-slate-800/60 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
      >
        {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
      </button>
    </div>
    <div className="mt-2 h-2 rounded-full bg-slate-800/40 overflow-hidden">
      <div
        className={`${strengthColor} h-2`}
        style={{ width: `${(strength / 5) * 100}%`, transition: 'width 200ms' }}
      />
    </div>
    {errors.password && touched.password && <div className="text-rose-400 text-xs mt-1">{errors.password}</div>}
  </label>
</div>


              <div>
  <label className="flex flex-col">
    <span className="text-xs text-slate-300 mb-1">Confirm password</span>
    <div className="relative">
      <input
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={form.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder=" Confirm password"
        className={`w-full pr-10 py-2 rounded-lg border ${errors.confirmPassword && touched.confirmPassword ? 'border-rose-500' : 'border-slate-700'} bg-slate-800/60 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400`}
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
      >
        {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
      </button>
    </div>
    {errors.confirmPassword && touched.confirmPassword && <div className="text-rose-400 text-xs mt-1">{errors.confirmPassword}</div>}
  </label>
</div>


              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>

            <div className="mt-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900/60 text-slate-300">Or continue with</span>
                </div>
              </div>

              {/* <div className="mt-4 grid grid-cols-3 gap-3">
                <button
                  className="flex items-center justify-center py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 text-sm hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <FaGoogle className="w-5 h-5 mr-2 text-amber-400" /> Google
                </button>

                <button
                  className="flex items-center justify-center py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 text-sm hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <FaTwitter className="w-5 h-5 mr-2 text-sky-400" /> Twitter
                </button>

                <button
                  className="flex items-center justify-center py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 text-sm hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <FaGithub className="w-5 h-5 mr-2 text-slate-200" /> GitHub
                </button>
              </div> */}
            </div>

            <p className="mt-6 text-center text-sm text-slate-300">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 font-medium hover:text-cyan-300 transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}