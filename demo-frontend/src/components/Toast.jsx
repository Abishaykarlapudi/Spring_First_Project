import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer({ toasts = [], onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const type = toast.type || 'info';
        return (
          <div key={toast.id} className={`toast-card toast-${type}`}>
            <div className="toast-icon">
              {type === 'success' && <CheckCircle2 size={18} />}
              {type === 'error' && <AlertCircle size={18} />}
              {type === 'warning' && <AlertTriangle size={18} />}
              {type === 'info' && <Info size={18} />}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button
              type="button"
              className="toast-close"
              onClick={() => onRemove(toast.id)}
              title="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
