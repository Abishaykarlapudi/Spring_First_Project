import { useState } from 'react';
import { Users, Sun, Moon } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthLayout({
  isDark,
  onToggleTheme,
  onLogin,
  onRegister,
  isLoading,
  onNotify
}) {
  const [authMode, setAuthMode] = useState('login');

  return (
    <div className="auth-page-container">
      {/* Theme Toggle - Fixed Top Right */}
      <div className="auth-topbar">
        <button
          type="button"
          className="btn-icon"
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Centered Glass Card */}
      <div className="auth-form-wrapper">
        {/* Brand Logo */}
        <div className="auth-brand-header">
          <div className="brand-icon-sm">
            <Users size={20} color="#ffffff" />
          </div>
          <div>
            <div className="auth-brand-name">VCube Directory</div>
            <div className="auth-brand-tagline">Contact & Record Management</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-switch" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={authMode === 'login'}
            className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={authMode === 'register'}
            className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => setAuthMode('register')}
          >
            Create Account
          </button>
        </div>

        {/* Active Form */}
        {authMode === 'login' ? (
          <LoginForm
            onLogin={onLogin}
            onSwitchToRegister={() => setAuthMode('register')}
            isLoading={isLoading}
            onNotify={onNotify}
          />
        ) : (
          <RegisterForm
            onRegister={onRegister}
            onSwitchToLogin={() => setAuthMode('login')}
            isLoading={isLoading}
          />
        )}

        {/* Footer */}
        <div className="auth-panel-footer">
          <span>&copy; {new Date().getFullYear()} VCube Directory Hub</span>
        </div>
      </div>
    </div>
  );
}
