import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Save, PlusCircle, AlertCircle } from 'lucide-react';

export default function RecordModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || '',
    email: initialData?.email || '',
    number: initialData?.number ? String(initialData.number) : ''
  }));

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validate = (data) => {
    const errs = {};
    if (!data.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (data.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!data.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    const cleanNum = data.number.replace(/\D/g, '');
    if (!data.number.trim()) {
      errs.number = 'Phone number is required.';
    } else if (cleanNum.length < 7 || cleanNum.length > 18) {
      errs.number = 'Phone must be between 7 and 18 digits.';
    }

    return errs;
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, number: true });

    if (Object.keys(validationErrors).length === 0) {
      const cleanNum = Number(formData.number.replace(/\D/g, ''));
      onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        number: cleanNum
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className={`modal-title-icon ${isEditing ? 'icon-amber' : 'icon-indigo'}`}>
              {isEditing ? <Save size={18} /> : <PlusCircle size={18} />}
            </div>
            <div>
              <h2 className="modal-title">
                {isEditing ? `Edit Record #${initialData.id}` : 'Create New Record'}
              </h2>
              <p className="modal-subtitle">
                {isEditing ? 'Modify all details for this contact entry' : 'Fill in the information below to add a new contact'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="record-name" className="form-label">
              Full Name <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                id="record-name"
                type="text"
                className={`form-input ${errors.name && touched.name ? 'input-error' : ''}`}
                placeholder="e.g. Alexander Smith"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                autoFocus
              />
            </div>
            {errors.name && touched.name && (
              <span className="field-error"><AlertCircle size={12} /> {errors.name}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="record-email" className="form-label">
              Email Address <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                id="record-email"
                type="email"
                className={`form-input ${errors.email && touched.email ? 'input-error' : ''}`}
                placeholder="e.g. alexander@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
            </div>
            {errors.email && touched.email && (
              <span className="field-error"><AlertCircle size={12} /> {errors.email}</span>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="form-group">
            <label htmlFor="record-phone" className="form-label">
              Phone Number <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <Phone size={16} className="input-icon" />
              <input
                id="record-phone"
                type="tel"
                className={`form-input ${errors.number && touched.number ? 'input-error' : ''}`}
                placeholder="e.g. 9876543210"
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
                onBlur={() => handleBlur('number')}
              />
            </div>
            {errors.number && touched.number && (
              <span className="field-error"><AlertCircle size={12} /> {errors.number}</span>
            )}
            <span className="field-hint">Numbers only (between 7 and 18 digits)</span>
          </div>

          {/* Modal Actions */}
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
