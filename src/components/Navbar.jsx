import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { MdLogout, MdExpandMore, MdNotifications, MdLightMode, MdMenu, MdSearch, MdAdd } from 'react-icons/md';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Check if route is active
  const isActive = (path) => location.pathname === path;

  // Mock notifications data
  const notifications = [
    { id: 1, title: 'New project assigned', message: 'You have been assigned to Project Alpha', time: '2 min ago', unread: true },
    { id: 2, title: 'Task completed', message: 'Database setup task completed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Meeting reminder', message: 'Team standup in 30 minutes', time: '2 hours ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Memoized role badge color
  const roleBadgeColor = useMemo(() => {
    switch (user?.role) {
      case 'admin':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'manager':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'user':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  }, [user?.role]);

  // Memoized avatar color
  const avatarColor = useMemo(() => {
    switch (user?.role) {
      case 'admin':
        return 'from-rose-500 to-pink-600';
      case 'manager':
        return 'from-violet-500 to-purple-600';
      case 'user':
        return 'from-cyan-500 to-blue-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  }, [user?.role]);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 shadow-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Brand Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png/management.png" 
                alt="Logo" 
                className="w-10 h-10 rounded-lg shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer" 
                onClick={() => navigate('/dashboard')}
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white leading-tight">Project Management</h1>
              </div>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/dashboard')} 
              className={`relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-200 font-medium ${
                isActive('/dashboard') 
                  ? 'text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400 after:rounded-full' 
                  : ''
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/projects')} 
              className={`relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-200 font-medium ${
                isActive('/projects') 
                  ? 'text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400 after:rounded-full' 
                  : ''
              }`}
            >
              Projects
            </button>
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')} 
                className={`relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-200 font-medium ${
                  isActive('/admin') 
                    ? 'text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400 after:rounded-full' 
                    : ''
                }`}
              >
                Admin
              </button>
            )}
          </div>

          {/* Center-Right: Search Bar */}
          <div className="hidden md:flex items-center relative">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-lg bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              />
              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/60 rounded-lg shadow-xl z-30">
                  <div className="p-4">
                    <p className="text-slate-300 text-sm">Search results for "{searchQuery}"</p>
                    <p className="text-slate-500 text-xs mt-1">No results found</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions & User Profile Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800/60 transition-colors duration-200"
            >
              <MdMenu className="w-6 h-6 text-white" />
            </button>

            {/* Quick Actions */}
            <button className="p-2 rounded-lg hover:bg-slate-800/60 transition-colors duration-200 group">
              <MdAdd className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            {/* Enhanced Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-slate-800/60 transition-colors duration-200 group"
              >
                <MdNotifications className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden z-20">
                    <div className="p-4 border-b border-slate-700/50">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      <p className="text-slate-400 text-xs">{unreadCount} unread</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors ${notification.unread ? 'bg-slate-700/20' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-cyan-400' : 'bg-slate-600'}`}></div>
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">{notification.title}</p>
                              <p className="text-slate-400 text-xs mt-1">{notification.message}</p>
                              <p className="text-slate-500 text-xs mt-2">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-slate-700/50">
                      <button className="w-full text-center text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button className="p-2 rounded-lg hover:bg-slate-800/60 transition-colors duration-200 group">
              <MdLightMode className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            {/* User Profile with Status Indicator */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-all duration-200 group"
              >
                {/* User Avatar with Status */}
                <div className="relative">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-md`}>
                    <span className="text-white font-semibold text-sm">
                      {user?.role === 'manager' ? 'M' : user?.role === 'admin' ? 'A' : user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </div>

                {/* User Info - Hidden on mobile */}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-white capitalize">{user?.role || 'Role'}</p>
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
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-md`}>
                            <span className="text-white font-bold text-lg">
                              {user?.role === 'manager' ? 'M' : user?.role === 'admin' ? 'A' : user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{user?.name || 'Guest'}</p>
                          <p className="text-xs text-slate-400">{user?.email || 'email@example.com'}</p>
                          <p className="text-xs text-green-400 mt-1">● Online</p>
                        </div>
                      </div>

                      {/* Role Badge */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${roleBadgeColor}`}>
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

          {/* Mobile Menu */}
          {showMobileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
                onClick={() => setShowMobileMenu(false)}
              />
              <div className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-xl z-50 lg:hidden">
                <div className="px-6 py-4 space-y-3">
                  {/* Mobile Search */}
                  <div className="relative md:hidden">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search projects..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full rounded-lg bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => { navigate('/dashboard'); setShowMobileMenu(false); }}
                      className={`block w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive('/dashboard') 
                          ? 'text-cyan-400 bg-slate-800/60' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => { navigate('/projects'); setShowMobileMenu(false); }}
                      className={`block w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive('/projects') 
                          ? 'text-cyan-400 bg-slate-800/60' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      Projects
                    </button>
                    {user?.role === 'admin' && (
                      <button 
                        onClick={() => { navigate('/admin'); setShowMobileMenu(false); }}
                        className={`block w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                          isActive('/admin') 
                            ? 'text-cyan-400 bg-slate-800/60' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        Admin
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}