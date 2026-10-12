import { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  Type, 
  ExternalLink,
  Database
} from 'lucide-react';
import { getAvatarStyle, getInitials, formatPhoneNumber, copyText } from '../utils/helpers';

export default function ViewDetailsModal({
  isOpen,
  onClose,
  record,
  onEdit,
  onPatchName,
  onDelete,
  onNotify
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  const avatarStyle = getAvatarStyle(record.name);
  const initials = getInitials(record.name);

  const handleCopy = async (text, label, key) => {
    const ok = await copyText(text);
    if (ok) {
      setCopiedKey(key);
      if (onNotify) onNotify(`Copied ${label}!`, 'info');
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box modal-box-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <span className="badge-pill">Record Profile</span>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Hero banner inside modal */}
        <div className="view-profile-hero">
          <div 
            className="view-avatar-large"
            style={{ background: avatarStyle.bg, color: avatarStyle.text }}
          >
            {initials}
          </div>
          <div className="view-profile-meta">
            <h2 className="view-profile-name">{record.name || 'Untitled Contact'}</h2>
            <div className="view-tags">
              <span className="id-badge">ID #{record.id}</span>
              <span className="table-badge"><Database size={11} /> demotable</span>
            </div>
          </div>
        </div>

        {/* Details list */}
        <div className="view-details-list">
          {/* Email row */}
          <div className="view-detail-card">
            <div className="detail-card-left">
              <div className="detail-card-icon icon-pink">
                <Mail size={18} />
              </div>
              <div>
                <span className="detail-card-label">Email Address</span>
                <div className="detail-card-value">
                  {record.email ? (
                    <a href={`mailto:${record.email}`} className="action-link">
                      {record.email}
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="muted-text">None provided</span>
                  )}
                </div>
              </div>
            </div>
            {record.email && (
              <button
                type="button"
                className="btn-icon btn-sm"
                onClick={() => handleCopy(record.email, 'Email', 'view-email')}
                title="Copy email"
              >
                {copiedKey === 'view-email' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            )}
          </div>

          {/* Phone row */}
          <div className="view-detail-card">
            <div className="detail-card-left">
              <div className="detail-card-icon icon-cyan">
                <Phone size={18} />
              </div>
              <div>
                <span className="detail-card-label">Phone Number</span>
                <div className="detail-card-value">
                  {record.number ? (
                    <a href={`tel:${record.number}`} className="action-link">
                      {formatPhoneNumber(record.number)}
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="muted-text">None provided</span>
                  )}
                </div>
              </div>
            </div>
            {record.number && (
              <button
                type="button"
                className="btn-icon btn-sm"
                onClick={() => handleCopy(String(record.number), 'Phone', 'view-phone')}
                title="Copy phone"
              >
                {copiedKey === 'view-phone' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="modal-actions space-between">
          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={() => {
              onClose();
              onDelete(record);
            }}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>

          <div className="actions-cluster">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onPatchName(record);
              }}
            >
              <Type size={15} />
              <span>Patch Name</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(record);
              }}
            >
              <Edit3 size={15} />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
