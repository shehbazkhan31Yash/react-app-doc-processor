import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../styles/auth.css';

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-buttons">
        <button
          className={`auth-btn ${showLogin ? 'active' : 'inactive'}`}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
        <button
          className={`auth-btn ${!showLogin ? 'active' : 'inactive'}`}
          onClick={() => setShowLogin(false)}
        >
          Register
        </button>
      </div>
      {showLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthPage;
