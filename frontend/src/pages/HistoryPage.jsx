import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, History, ExternalLink, PlusCircle, CheckCircle } from 'lucide-react';
import { fetchAllHistory } from '../api/todoApi';
import ThemeToggle from '../components/ThemeToggle';

/**
 * HistoryPage — Dedicated activity history page (MPA Page 3).
 * Fetches all history events across todos and allows filtering by:
 * - Todos Added
 * - Completed Todos
 */
export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('added'); // 'added', 'completed'

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllHistory();
      setHistory(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Filter logic based on tab: only keep Added (created) and Completed (completed to true)
  const filteredHistory = history.filter((entry) => {
    if (activeTab === 'added') {
      return entry.event === 'created';
    }
    if (activeTab === 'completed') {
      return entry.event === 'updated' && entry.changes?.completed?.to === true;
    }
    return false;
  });

  const getEventBadge = (entry) => {
    if (entry.event === 'created') {
      return (
        <span className="history-event__badge history-event__badge--created">
          <PlusCircle size={10} style={{ marginRight: '0.25rem' }} /> Added
        </span>
      );
    }
    if (entry.changes?.completed?.to === true) {
      return (
        <span className="history-event__badge history-event__badge--completed">
          <CheckCircle size={10} style={{ marginRight: '0.25rem' }} /> Completed
        </span>
      );
    }
    return null;
  };

  const goBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__inner">
          <div className="page-header__brand">
            <button className="btn btn-ghost" onClick={goBack} id="back-btn" aria-label="Back to list">
              <ArrowLeft size={16} /> Back to Todos
            </button>
            <span className="page-header__logo" aria-hidden="true">
              <History size={20} style={{ color: 'var(--clr-primary)' }} />
            </span>
            <h1 className="page-header__title">Activity History</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="page-main">
        {/* Tab Controls */}
        <div className="tabs-container" role="tablist" aria-label="History categories">
          <button
            role="tab"
            aria-selected={activeTab === 'added'}
            className={`tab-btn ${activeTab === 'added' ? 'active' : ''}`}
            onClick={() => setActiveTab('added')}
            id="tab-added"
          >
            Todos Added
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'completed'}
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
            id="tab-completed"
          >
            Completed Todos
          </button>
        </div>

        {/* Content */}
        {loading && (
          <div className="loading-container" aria-live="polite">
            <div className="spinner" />
            <p>Loading activity history…</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-banner" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        {!loading && !error && filteredHistory.length === 0 && (
          <div className="empty-state" style={{ padding: '3rem 1rem' }}>
            <div className="empty-state__icon" style={{ opacity: 0.5, display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <History size={48} />
            </div>
            <p className="empty-state__message" style={{ textAlign: 'center', color: 'var(--clr-text-muted)' }}>
              {activeTab === 'added'
                ? 'No todos added yet.'
                : 'No completed todos found in history.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredHistory.length > 0 && (
          <div className="history-section" style={{ border: 'none', background: 'var(--clr-surface)', boxShadow: 'none' }}>
            <div className="history-body" style={{ padding: 0, border: 'none' }}>
              <ol className="history-timeline">
                {filteredHistory.map((entry, idx) => (
                  <li key={idx} className="history-event">
                    <div className="history-event__dot" />
                    <div className="history-event__content">
                      <div className="history-event__header">
                        {getEventBadge(entry)}
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
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
