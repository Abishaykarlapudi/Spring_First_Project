import { useState, useEffect } from 'react';
import { X, Type, Check, AlertCircle } from 'lucide-react';

export default function PatchNameModal({
  isOpen,
  onClose,
  onSubmit,
  record = null,
  isSubmitting = false
}) {
  const [name, setName] = useState(() => record?.name || '');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    onSubmit(record.id, name.trim());
  };

  if (!isOpen || !record) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-title-icon icon-purple">
              <Type size={18} />
            </div>
            <div>
              <h2 className="modal-title">Update Name Only</h2>
              <p className="modal-subtitle">Quick patch record #{record.id}</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="patch-name-input" className="form-label">
              New Contact Name <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <Type size={16} className="input-icon" />
              <input
                id="patch-name-input"
                type="text"
                className={`form-input ${error ? 'input-error' : ''}`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter updated name"
                autoFocus
              />
            </div>
            {error && (
              <span className="field-error"><AlertCircle size={12} /> {error}</span>
            )}
            <span className="field-hint">
              This triggers PATCH <code>/dmo/updatename/{record.id}</code> leaving other fields intact.
            </span>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Check size={16} />
              <span>{isSubmitting ? 'Updating...' : 'Update Name'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
