import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>
            Welcome, {user.firstName} {user.lastName} ({user.userName})
          </p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user info available.</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}