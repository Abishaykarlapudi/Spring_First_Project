import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginForm({
  onLogin,
  onSwitchToRegister,
  isLoading,
  onNotify
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onLogin({ email: email.trim(), password, rememberMe });
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@vcube.com');
    setPassword('demo1234');
    onLogin({ email: 'demo@vcube.com', password: 'demo1234', rememberMe: true, isDemo: true });
  };

  const handleForgotPassword = () => {
    if (onNotify) {
      onNotify('Password reset: Contact administrator or use Quick Demo Account.', 'info');
    }
  };

  return (
    <div className="auth-form-card">
      <div className="auth-form-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to access your contact directory</p>
      </div>

      {/* Demo Account Quick Shortcut Button */}
      <div className="demo-login-box">
        <button
          type="button"
          className="demo-login-btn"
          onClick={handleDemoLogin}
          disabled={isLoading}
        >
          <Sparkles size={16} className="sparkle-icon" />
          <span>Quick Demo Login (1-Click)</span>
        </button>
      </div>

      <div className="auth-divider">
        <span>or sign in with email</span>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">Email Address</label>
          <div className="input-wrap">
            <Mail size={16} className="input-icon" />
            <input
              id="login-email"
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              autoComplete="email"
              autoFocus
            />
          </div>
          {errors.email && (
            <span className="field-error"><AlertCircle size={12} /> {errors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <div className="label-with-link">
            <label htmlFor="login-password" className="form-label">Password</label>
            <button
              type="button"
              className="text-link-sm"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          <div className="input-wrap">
            <Lock size={16} className="input-icon" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <span className="field-error"><AlertCircle size={12} /> {errors.password}</span>
          )}
        </div>

        {/* Remember Me */}
        <div className="form-checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me on this browser</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="auth-form-footer">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="text-link font-semibold"
            onClick={onSwitchToRegister}
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
