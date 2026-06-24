/**
 * EmptyState — shown when no todos match the current filters.
 * @param {{ message?: string, onAdd?: () => void }} props
 */
export default function EmptyState({ message = 'No todos found', onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
          <rect x="22" y="28" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <path d="M28 38h24M28 44h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <circle cx="40" cy="22" r="5" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          <path d="M37 22l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        </svg>
      </div>
      <h3 className="empty-state__title">{message}</h3>
      <p className="empty-state__subtitle">
        {onAdd ? 'Get started by adding your first task.' : 'Try adjusting your filters or search terms.'}
      </p>
      {onAdd && (
        <button className="btn btn-primary" onClick={onAdd} id="empty-state-add-btn">
          + Add your first todo
        </button>
      )}
    </div>
  );
}
