import { 
  Users, 
  Plus, 
  Sun, 
  Moon, 
  Server, 
  RefreshCw,
  LogOut,
  Shield
} from 'lucide-react';
import { getAvatarStyle, getInitials } from '../utils/helpers';

export default function Navbar({ 
  isDark, 
  onToggleTheme, 
  onOpenAddModal, 
  backendStatus, 
  onRefresh, 
  isRefreshing,
  totalCount,
  currentUser,
  onLogout
}) {
  const avatarStyle = currentUser ? getAvatarStyle(currentUser.fullName || currentUser.email) : null;
  const initials = currentUser ? getInitials(currentUser.fullName || currentUser.email) : 'U';

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="brand">
          <div className="brand-icon">
            <Users size={22} color="#ffffff" />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              VCube Directory
              <span className="brand-badge">{totalCount} records</span>
            </div>
            <div className="brand-sub">Spring Boot + React CRUD Hub</div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Backend Status Pill */}
          <div 
            className={`status-pill ${backendStatus}`} 
            title={backendStatus === 'online' ? 'Spring Boot API (port 5000) Connected' : 'Connecting to backend...'}
          >
            <span className="status-dot"></span>
            <Server size={13} />
            <span className="status-label">
              {backendStatus === 'online' ? 'API Online' : 'Connecting...'}
            </span>
          </div>

          {/* Refresh Action */}
          <button 
            type="button" 
            className="btn-icon" 
            onClick={onRefresh} 
            title="Refresh records"
            disabled={isRefreshing}
          >
            <RefreshCw size={17} className={isRefreshing ? 'spin-anim' : ''} />
          </button>

          {/* Theme Toggle */}
          <button 
            type="button" 
            className="btn-icon" 
            onClick={onToggleTheme} 
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Primary Add Button */}
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={onOpenAddModal}
          >
            <Plus size={16} />
            <span>New Record</span>
          </button>

          {/* User Profile & Logout */}
          {currentUser && (
            <div className="user-profile-widget">
              <div 
                className="user-profile-avatar" 
                style={{ background: avatarStyle?.bg, color: avatarStyle?.text }}
                title={currentUser.email}
              >
                {initials}
              </div>
              <div className="user-profile-info">
                <span className="user-profile-name">{currentUser.fullName || 'User'}</span>
                <span className="user-profile-role">
                  <Shield size={10} />
                  {currentUser.role || 'USER'}
                </span>
              </div>
              <button
                type="button"
                className="btn-icon btn-logout"
                onClick={onLogout}
                title="Sign out of your account"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
