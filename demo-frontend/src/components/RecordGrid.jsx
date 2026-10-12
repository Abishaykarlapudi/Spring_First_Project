import { useState } from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Type, 
  Mail, 
  Phone, 
  Copy, 
  Check 
} from 'lucide-react';
import { getAvatarStyle, getInitials, formatPhoneNumber, copyText } from '../utils/helpers';

export default function RecordGrid({
  records,
  onViewRecord,
  onEditRecord,
  onPatchName,
  onDeleteRecord,
  onNotify
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = async (text, label, key) => {
    const success = await copyText(text);
    if (success) {
      setCopiedKey(key);
      if (onNotify) onNotify(`Copied ${label}!`, 'info');
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  return (
    <div className="record-grid">
      {records.map((record) => {
        const avatarStyle = getAvatarStyle(record.name);
        const initials = getInitials(record.name);
        const emailKey = `card-email-${record.id}`;
        const phoneKey = `card-phone-${record.id}`;

        return (
          <div key={record.id} className="contact-card">
            {/* Card Header */}
            <div className="card-top">
              <div 
                className="card-avatar"
                style={{ background: avatarStyle.bg, color: avatarStyle.text }}
              >
                {initials}
              </div>
              <div className="card-top-info">
                <span className="card-id-tag">#{record.id}</span>
                <h3 className="card-name" title={record.name}>
                  {record.name || 'Untitled Contact'}
                </h3>
              </div>
            </div>

            {/* Card Body with contact details */}
            <div className="card-details">
              <div className="detail-item">
                <Mail size={15} className="detail-icon" />
                <a 
                  href={`mailto:${record.email}`} 
                  className="detail-link"
                  title={record.email}
                >
                  {record.email || 'No email provided'}
                </a>
                {record.email && (
                  <button
                    type="button"
                    className="copy-mini-btn"
                    onClick={() => handleCopy(record.email, 'Email', emailKey)}
                    title="Copy email"
                  >
                    {copiedKey === emailKey ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                )}
              </div>

              <div className="detail-item">
                <Phone size={15} className="detail-icon" />
                <a 
                  href={`tel:${record.number}`} 
                  className="detail-link"
                  title={record.number}
                >
                  {formatPhoneNumber(record.number)}
                </a>
                {record.number && (
                  <button
                    type="button"
                    className="copy-mini-btn"
                    onClick={() => handleCopy(String(record.number), 'Phone', phoneKey)}
                    title="Copy phone"
                  >
                    {copiedKey === phoneKey ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="card-footer">
              <button
                type="button"
                className="card-action-btn"
                onClick={() => onViewRecord(record)}
                title="View full details"
              >
                <Eye size={14} />
                <span>View</span>
              </button>

              <button
                type="button"
                className="card-action-btn"
                onClick={() => onPatchName(record)}
                title="Patch Name"
              >
                <Type size={14} />
                <span>Name</span>
              </button>

              <button
                type="button"
                className="card-action-btn"
                onClick={() => onEditRecord(record)}
                title="Edit all fields"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                className="card-action-btn btn-danger-soft"
                onClick={() => onDeleteRecord(record)}
                title="Delete record"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
