import { useState, useCallback } from 'react';
import { History, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { fetchAllHistory } from '../api/todoApi';

/**
 * GlobalHistory — Collapsible section showing all change events across
 * every todo, sorted newest-first. Lazy-loads on first open.
 * Displayed on the TodoList (home) page.
 */
export default function GlobalHistory() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const formatFieldValue = (field, value) => {
    if (value === null || value === undefined) return '—';
    if (field === 'completed') return value ? 'Completed' : 'Active';
    if (field === 'dueDate') return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return String(value);
  };

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllHistory();
      setHistory(data);
      setLoaded(true);
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [loaded]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) load();
  };

  return (
    <div className="history-section" style={{ marginTop: '1.5rem' }}>
      <button
        className="history-toggle"
        onClick={handleToggle}
        aria-expanded={open}
        id="global-history-toggle-btn"
      >
        <span className="history-toggle__label">
          <History size={16} />
          Recent Activity
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="history-body" aria-live="polite">
          {loading && (
            <div className="loading-container" style={{ padding: '1.5rem' }}>
              <div className="spinner" style={{ width: '1.5rem', height: '1.5rem' }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>Loading activity…</p>
            </div>
          )}

          {error && (
            <div className="error-banner" style={{ margin: '0.5rem 0' }}>⚠️ {error}</div>
          )}

          {!loading && !error && history.length === 0 && (
            <p className="history-empty">No activity yet. Create or edit a todo to see changes here.</p>
          )}

          {!loading && !error && history.length > 0 && (
            <ol className="history-timeline">
              {history.map((entry, idx) => (
                <li key={idx} className="history-event">
                  <div className="history-event__dot" />
                  <div className="history-event__content">
                    <div className="history-event__header">
                      <span className={`history-event__badge history-event__badge--${entry.event}`}>
                        {entry.event === 'created' ? 'Created' : 'Updated'}
                      </span>
                      <a
                        href={`/todo.html?id=${entry.todoId}`}
                        className="history-todo-link"
                        title={`View "${entry.todoTitle}"`}
                      >
                        {entry.todoTitle}
                        <ExternalLink size={11} style={{ marginLeft: '0.3rem', opacity: 0.7 }} />
                      </a>
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
  );
}
