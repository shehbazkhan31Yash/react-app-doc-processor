import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../src/features/auth/authslice';
import AuthPage from './pages/AuthPage';
import './styles/auth.css';

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  if (user) {
    return (
      <div className="auth-container" style={{ marginTop: '80px' }}>
        <div className="welcome-container">
          <h1>Welcome! 👋</h1>
          <p>{user.name || user.email}</p>
          <p>You are successfully logged in!</p>
          <button
            onClick={() => dispatch(logout())}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return <AuthPage />;
}

export default App;
