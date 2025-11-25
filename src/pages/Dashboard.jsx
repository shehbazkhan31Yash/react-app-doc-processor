
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import AdminDashboard from '../features/admin/AdminDashboard';
import ManagerDashboard from '../features/manager/ManagerDashboard';
import UserDashboard from '../features/user/UserDashboard';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);

  // If token exists but no user data, redirect to login
  useEffect(() => {
    if (token && !user) {
      dispatch(logout());
      navigate('/login');
    }
  }, [token, user, navigate, dispatch]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const roleComponent = {
    admin: <AdminDashboard />,
    manager: <ManagerDashboard />,
    user: <UserDashboard />
  };

  return (
    <div>
      {/* <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Project Management System</h1>
          <p className="text-sm">Logged in as: {user.userName} ({user.role})</p>
        </div>
        <button
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav> */}

      {roleComponent[user.role] || <p>Unknown role</p>}
    </div>
  );
}
