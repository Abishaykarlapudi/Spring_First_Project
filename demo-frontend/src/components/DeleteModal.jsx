import { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  record = null,
  isDeleting = false
}) {
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

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-title-icon icon-danger">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="modal-title text-danger">Confirm Deletion</h2>
              <p className="modal-subtitle">Permanent action</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="delete-modal-body">
          <p className="delete-warning-text">
            Are you sure you want to delete record <strong>#{record.id}</strong>?
          </p>

          <div className="delete-target-preview">
            <div className="preview-row">
              <span className="preview-label">Name:</span>
              <span className="preview-value">{record.name || 'Untitled'}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Email:</span>
              <span className="preview-value">{record.email || '—'}</span>
            </div>
          </div>

          <p className="delete-subwarning">
            This will permanently remove the record from MySQL (<code>demotable</code>). This action cannot be undone.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(record.id)}
            disabled={isDeleting}
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
