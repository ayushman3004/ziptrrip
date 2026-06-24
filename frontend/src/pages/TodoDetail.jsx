import { useState } from 'react';
import { ArrowLeft, CheckCircle, Undo, Pencil, Trash2, Copy, Check, History, ChevronDown, ChevronUp } from 'lucide-react';
import { useTodo } from '../hooks/useTodo';
import PriorityBadge from '../components/PriorityBadge';
import AddEditModal from '../components/AddEditModal';
import ThemeToggle from '../components/ThemeToggle';

/**
 * TodoDetail — Page 2, route "/todo?id=xxx".
 * Reads ?id= from URLSearchParams. Fetches the todo independently on mount.
 * Navigation uses window.location.href (full page reloads, no shared state).
 */
export default function TodoDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const {
    todo, loading, error,
    updateCurrentTodo, deleteCurrentTodo, toggleCurrentTodo,
    history, historyLoading, historyError, loadHistory,
  } = useTodo(id);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const goBack = () => { window.location.href = '/'; };

  const handleUpdate = async (data) => {
    setActionError(null);
    await updateCurrentTodo(data);
    setEditModalOpen(false);
  };

  const handleToggle = async () => {
    setActionError(null);
    try {
      await toggleCurrentTodo();
    } catch (err) {
      setActionError(err.message || 'Failed to toggle');
    }
  };

  const handleDelete = async () => {
    setActionError(null);
    try {
      await deleteCurrentTodo();
    } catch (err) {
      setActionError(err.message || 'Failed to delete');
      setDeleteConfirm(false);
    }
  };

  const handleCopy = () => {
    if (todo?.id) {
      navigator.clipboard.writeText(todo.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleHistoryToggle = () => {
    const next = !historyOpen;
    setHistoryOpen(next);
    if (next) loadHistory(); // lazy fetch on first open
  };

  const formatDate = (iso) => {
    if (!iso) return 'Not set';
    return new Date(iso).toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDateOnly = (iso) => {
    if (!iso) return 'Not set';
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  };

  /** Format a raw field value for display in the history diff table. */
  const formatFieldValue = (field, value) => {
    if (value === null || value === undefined) return '—';
    if (field === 'completed') return value ? 'Completed' : 'Active';
    if (field === 'dueDate') return formatDateOnly(value);
    return String(value);
  };

  const isOverdue = todo?.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div className="page">
      {/* Header */}
      <header className="page-header">
        <div className="page-header__inner">
          <div className="page-header__brand">
            <button className="btn btn-ghost" onClick={goBack} id="back-btn" aria-label="Back to list">
              <ArrowLeft size={16} /> Back
            </button>
            <span className="page-header__logo" aria-hidden="true">
              <CheckCircle size={20} style={{ color: 'var(--clr-primary)' }} />
            </span>
            <h1 className="page-header__title">Todo Detail</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="page-main">
        {/* Loading */}
        {loading && (
          <div className="loading-container" aria-live="polite">
            <div className="spinner" />
            <p>Loading todo…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="detail-error">
            <div className="error-banner" role="alert">
              <span>⚠️ {error}</span>
            </div>
            <button className="btn btn-secondary" onClick={goBack} style={{ marginTop: '1rem' }}>
              <ArrowLeft size={16} /> Go back to list
            </button>
          </div>
        )}

        {/* Action error */}
        {actionError && (
          <div className="error-banner" role="alert" style={{ marginBottom: '1rem' }}>
            ⚠️ {actionError}
          </div>
        )}

        {/* Todo Detail Card */}
        {!loading && !error && todo && (
          <div className="detail-card">
            {/* Title & status */}
            <div className="detail-card__header">
              <div className="detail-card__title-row">
                <h2 className={`detail-card__title ${todo.completed ? 'detail-card__title--done' : ''}`}>
                  {todo.title}
                </h2>
                <PriorityBadge priority={todo.priority} />
                {isOverdue && <span className="badge badge-overdue">Overdue</span>}
              </div>

              <div className="detail-card__actions">
                <button
                  className={`btn ${todo.completed ? 'btn-secondary' : 'btn-success'}`}
                  onClick={handleToggle}
                  id="toggle-complete-btn"
                >
                  {todo.completed ? (
                    <><Undo size={16} /> Mark Incomplete</>
                  ) : (
                    <><CheckCircle size={16} /> Mark Complete</>
                  )}
                </button>
                <button className="btn btn-primary" onClick={() => setEditModalOpen(true)} id="detail-edit-btn">
                  <Pencil size={16} /> Edit
                </button>
                <button className="btn btn-danger" onClick={() => setDeleteConfirm(true)} id="detail-delete-btn">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>

            {/* Metadata grid */}
            <div className="detail-card__fields">
              <div className="detail-grid">
                {/* ID */}
                <div className="detail-grid-item">
                  <span className="detail-grid-label">ID</span>
                  <div className="uuid-container">
                    <span className="uuid-text">{todo.id.slice(0, 8)}...</span>
                    <button
                      className={`uuid-copy-btn ${copied ? 'uuid-copy-btn--success' : ''}`}
                      onClick={handleCopy}
                      title={copied ? 'Copied!' : 'Copy full ID'}
                      aria-label="Copy ID"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="detail-grid-item">
                  <span className="detail-grid-label">Status</span>
                  <span className={`status-pill ${todo.completed ? 'status-pill--completed' : 'status-pill--active'}`}>
                    {todo.completed ? 'Completed' : 'Active'}
                  </span>
                </div>

                {/* Priority */}
                <div className="detail-grid-item">
                  <span className="detail-grid-label">Priority</span>
                  <div style={{ marginTop: '0.2rem' }}>
                    <PriorityBadge priority={todo.priority} />
                  </div>
                </div>

                {/* Due Date */}
                <div className="detail-grid-item">
                  <span className="detail-grid-label">Due Date</span>
                  <span className={`detail-grid-value ${isOverdue ? 'detail-field__value--overdue' : ''}`}>
                    {formatDateOnly(todo.dueDate)}
                  </span>
                </div>

                {/* Created At */}
                <div className="detail-grid-item">
                  <span className="detail-grid-label">Created At</span>
                  <span className="detail-grid-value">{formatDate(todo.createdAt)}</span>
                </div>

                {/* Updated At */}
                <div className="detail-grid-item">
                  <span className="detail-grid-label">Updated At</span>
                  <span className="detail-grid-value">{formatDate(todo.updatedAt)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="detail-field">
                <span className="detail-field__label">Description</span>
                <div className="detail-field__value" style={{ background: 'var(--clr-surface-2)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }}>
                  {todo.description || <em className="detail-field__empty">No description provided.</em>}
                </div>
              </div>

              {/* ── Change History ── */}
              <div className="history-section">
                <button
                  className="history-toggle"
                  onClick={handleHistoryToggle}
                  aria-expanded={historyOpen}
                  id="history-toggle-btn"
                >
                  <span className="history-toggle__label">
                    <History size={16} />
                    Change History
                  </span>
                  {historyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {historyOpen && (
                  <div className="history-body" aria-live="polite">
                    {historyLoading && (
                      <div className="loading-container" style={{ padding: '1.5rem' }}>
                        <div className="spinner" style={{ width: '1.5rem', height: '1.5rem' }} />
                        <p style={{ fontSize: 'var(--text-sm)' }}>Loading history…</p>
                      </div>
                    )}

                    {historyError && (
                      <div className="error-banner" style={{ margin: '1rem 0' }}>
                        ⚠️ {historyError}
                      </div>
                    )}

                    {!historyLoading && !historyError && history.length === 0 && (
                      <p className="history-empty">No history available for this todo.</p>
                    )}

                    {!historyLoading && !historyError && history.length > 0 && (
                      <ol className="history-timeline">
                        {[...history].reverse().map((entry, idx) => (
                          <li key={idx} className="history-event">
                            <div className="history-event__dot" />
                            <div className="history-event__content">
                              <div className="history-event__header">
                                <span className={`history-event__badge history-event__badge--${entry.event}`}>
                                  {entry.event === 'created' ? 'Created' : 'Updated'}
                                </span>
                                <time className="history-event__time" dateTime={entry.timestamp}>
                                  {formatDate(entry.timestamp)}
                                </time>
                              </div>

                              {entry.event === 'updated' && Object.keys(entry.changes).length > 0 && (
                                <table className="history-changes-table">
                                  <thead>
                                    <tr>
                                      <th>Field</th>
                                      <th>From</th>
                                      <th>To</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(entry.changes).map(([field, { from, to }]) => (
                                      <tr key={field}>
                                        <td className="history-changes-table__field">{field}</td>
                                        <td className="history-changes-table__from">{formatFieldValue(field, from)}</td>
                                        <td className="history-changes-table__to">{formatFieldValue(field, to)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}

                              {entry.event === 'updated' && Object.keys(entry.changes).length === 0 && (
                                <p className="history-no-changes">No tracked fields changed.</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editModalOpen && todo && (
        <AddEditModal
          todo={todo}
          onSubmit={handleUpdate}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-del-title">
          <div className="modal modal--sm">
            <div className="modal__header">
              <h2 id="confirm-del-title" className="modal__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trash2 size={18} /> Delete Todo?
              </h2>
            </div>
            <p className="modal__body-text">
              This will permanently delete <strong>"{todo?.title}"</strong>. This action cannot be undone.
            </p>
            <div className="modal__actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(false)} id="detail-cancel-delete-btn">
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} id="detail-confirm-delete-btn">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
