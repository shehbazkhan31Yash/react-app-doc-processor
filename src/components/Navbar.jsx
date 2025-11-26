import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { MdLogout, MdPerson, MdExpandMore } from 'react-icons/md';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'manager':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'user':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getAvatarColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-rose-500 to-pink-600';
      case 'manager':
        return 'from-violet-500 to-purple-600';
      case 'user':
        return 'from-cyan-500 to-blue-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo & Brand Section */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">PM</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white leading-tight">Project Management</h1>
                {/* <p className="text-xs text-slate-400">System</p> */}
              </div>
            </div>
          </div>

          {/* Right: User Profile Section */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-all duration-200 group"
            >
              {/* User Avatar */}
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getAvatarColor(user?.role)} flex items-center justify-center shadow-md`}>
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              
              {/* User Info - Hidden on mobile */}
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-white">{user?.name || 'user'}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role || 'Role'}</p>
              </div>

              {/* Dropdown Arrow */}
              <MdExpandMore className="w-5 h-5 text-slate-400 group-hover:text-slate-300 transition-colors" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                
                <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden z-20">
                  {/* User Info Section */}
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getAvatarColor(user?.role)} flex items-center justify-center shadow-md`}>
                        <span className="text-white font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{user?.name || 'admin'}</p>
                        <p className="text-xs text-slate-400">{user?.email || 'email@example.com'}</p>
                      </div>
                    </div>
                    
                    {/* Role Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getRoleBadgeColor(user?.role)}`}>
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {user?.role || 'Role'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors group"
                  >
                    <MdLogout className="w-5 h-5 text-rose-400 group-hover:text-rose-300 transition-colors" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
