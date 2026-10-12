import { useState } from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Type, 
  Copy, 
  Mail, 
  Phone,
  Check
} from 'lucide-react';
import { getAvatarStyle, getInitials, formatPhoneNumber, copyText } from '../utils/helpers';

export default function RecordTable({ 
  records, 
  onViewRecord, 
  onEditRecord, 
  onPatchName, 
  onDeleteRecord,
  onNotify
}) {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, label, idKey) => {
    const success = await copyText(text);
    if (success) {
      setCopiedField(idKey);
      if (onNotify) onNotify(`Copied ${label} to clipboard!`, 'info');
      setTimeout(() => setCopiedField(null), 1800);
    }
  };

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="modern-table">
          <thead>
            <tr>
              <th className="th-id">ID</th>
              <th className="th-user">Contact</th>
              <th className="th-email">Email Address</th>
              <th className="th-phone">Phone Number</th>
              <th className="th-actions text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const avatarStyle = getAvatarStyle(record.name);
              const initials = getInitials(record.name);
              const emailKey = `email-${record.id}`;
              const phoneKey = `phone-${record.id}`;

              return (
                <tr key={record.id} className="table-row">
                  {/* ID */}
                  <td className="td-id">
                    <span className="id-badge">#{record.id}</span>
                  </td>

                  {/* Name + Avatar */}
                  <td className="td-user">
                    <div className="user-cell">
                      <div 
                        className="avatar-circle" 
                        style={{ background: avatarStyle.bg, color: avatarStyle.text }}
                      >
                        {initials}
                      </div>
                      <div className="user-cell-meta">
                        <span className="user-name" title={record.name}>
                          {record.name || 'Untitled Contact'}
                        </span>
                        <span className="user-subid">Record ID: {record.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="td-email">
                    <div className="copyable-pill-wrap">
                      <a 
                        href={`mailto:${record.email}`} 
                        className="email-link"
                        title={`Send email to ${record.email}`}
                      >
                        <Mail size={14} className="cell-icon" />
                        <span>{record.email || '—'}</span>
                      </a>
                      {record.email && (
                        <button
                          type="button"
                          className="copy-mini-btn"
                          onClick={() => handleCopy(record.email, 'Email', emailKey)}
                          title="Copy email address"
                        >
                          {copiedField === emailKey ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="td-phone">
                    <div className="copyable-pill-wrap">
                      <a 
                        href={`tel:${record.number}`} 
                        className="phone-link"
                        title={`Call ${record.number}`}
                      >
                        <Phone size={14} className="cell-icon" />
                        <span>{formatPhoneNumber(record.number)}</span>
                      </a>
                      {record.number && (
                        <button
                          type="button"
                          className="copy-mini-btn"
                          onClick={() => handleCopy(String(record.number), 'Phone number', phoneKey)}
                          title="Copy phone number"
                        >
                          {copiedField === phoneKey ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="td-actions text-right">
                    <div className="actions-cluster">
                      <button
                        type="button"
                        className="action-btn action-view"
                        onClick={() => onViewRecord(record)}
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        className="action-btn action-patch"
                        onClick={() => onPatchName(record)}
                        title="Quick edit name (PATCH)"
                      >
                        <Type size={15} />
                      </button>

                      <button
                        type="button"
                        className="action-btn action-edit"
                        onClick={() => onEditRecord(record)}
                        title="Edit all fields (PUT)"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        className="action-btn action-delete"
                        onClick={() => onDeleteRecord(record)}
                        title="Delete record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
