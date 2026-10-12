import { useState, useMemo } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterForm({
  onRegister,
  onSwitchToLogin,
  isLoading
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState({});

  // Password strength calculation
  const strength = useMemo(() => {
    if (!password) return { score: 0, text: '', color: 'none' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'danger' };
    if (score <= 3) return { score: 2, text: 'Medium', color: 'warning' };
    return { score: 3, text: 'Strong', color: 'success' };
  }, [password]);

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) {
      errs.fullName = 'Full name is required.';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters.';
    }

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

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      errs.terms = 'You must accept the terms to continue.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onRegister({
        fullName: fullName.trim(),
        email: email.trim(),
        password
      });
    }
  };

  return (
    <div className="auth-form-card">
      <div className="auth-form-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join VCube Directory to manage your contacts</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="reg-name" className="form-label">Full Name</label>
          <div className="input-wrap">
            <User size={16} className="input-icon" />
            <input
              id="reg-name"
              type="text"
              className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              autoFocus
            />
          </div>
          {errors.fullName && (
            <span className="field-error"><AlertCircle size={12} /> {errors.fullName}</span>
          )}
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label htmlFor="reg-email" className="form-label">Email Address</label>
          <div className="input-wrap">
            <Mail size={16} className="input-icon" />
            <input
              id="reg-email"
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
            />
          </div>
          {errors.email && (
            <span className="field-error"><AlertCircle size={12} /> {errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="reg-password" className="form-label">Password</label>
          <div className="input-wrap">
            <Lock size={16} className="input-icon" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
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

          {/* Password Strength Meter */}
          {password && (
            <div className="strength-meter-wrap">
              <div className="strength-bars">
                <span className={`strength-bar ${strength.score >= 1 ? `bar-${strength.color}` : ''}`}></span>
                <span className={`strength-bar ${strength.score >= 2 ? `bar-${strength.color}` : ''}`}></span>
                <span className={`strength-bar ${strength.score >= 3 ? `bar-${strength.color}` : ''}`}></span>
              </div>
              <span className={`strength-label text-${strength.color}`}>
                Strength: {strength.text}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
          <div className="input-wrap">
            <Lock size={16} className="input-icon" />
            <input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
            />
          </div>
          {errors.confirmPassword && (
            <span className="field-error"><AlertCircle size={12} /> {errors.confirmPassword}</span>
          )}
        </div>

        {/* Terms agreement */}
        <div className="form-checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
              }}
            />
            <span>I agree to the Terms of Service & Privacy Policy</span>
          </label>
          {errors.terms && (
            <span className="field-error"><AlertCircle size={12} /> {errors.terms}</span>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Creating account...</span>
          ) : (
            <>
              <UserPlus size={16} />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-form-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="text-link font-semibold"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
