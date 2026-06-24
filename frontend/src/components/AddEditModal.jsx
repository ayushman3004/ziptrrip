import { useState, useEffect } from 'react';

const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

/**
 * AddEditModal — modal form for both creating and editing todos.
 * When `todo` prop is provided, it pre-fills the form (edit mode).
 * When `todo` is null, the form is blank (add mode).
 *
 * @param {{
 *   todo: Object | null,
 *   onSubmit: (data: Object) => Promise<void>,
 *   onClose: () => void,
 * }} props
 */
export default function AddEditModal({ todo, onSubmit, onClose }) {
  const isEdit = Boolean(todo);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      });
    } else {
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
    }
    setFormError(null);
  }, [todo]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.title.trim()) {
      setFormError('Title is required');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true"
         aria-labelledby="modal-title">
      <div className="modal">
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {isEdit ? '✏️ Edit Todo' : '✨ Add New Todo'}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal" id="modal-close-btn">✕</button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit} noValidate id="add-edit-form">
          {formError && (
            <div className="form-error" role="alert" id="form-error-msg">
              ⚠️ {formError}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label htmlFor="todo-title" className="form-label">
              Title <span className="form-required">*</span>
            </label>
            <input
              id="todo-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              autoFocus
              required
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="todo-description" className="form-label">Description</label>
            <textarea
              id="todo-description"
              name="description"
              className="form-textarea"
              placeholder="Add a description (optional)"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Priority + Due Date row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="todo-priority" className="form-label">Priority</label>
              <select
                id="todo-priority"
                name="priority"
                className="form-select"
                value={form.priority}
                onChange={handleChange}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="todo-due-date" className="form-label">Due Date</label>
              <input
                id="todo-due-date"
                name="dueDate"
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal__actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              id="modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="modal-submit-btn"
            >
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
