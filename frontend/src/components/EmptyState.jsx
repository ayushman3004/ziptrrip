import { ClipboardList, Plus } from 'lucide-react';

/**
 * EmptyState — shown when no todos match the current filters.
 * @param {{ message?: string, onAdd?: () => void }} props
 */
export default function EmptyState({ message = 'No todos found', onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" style={{ color: 'var(--clr-primary)', opacity: 0.85, marginBottom: '1rem' }} aria-hidden="true">
        <ClipboardList size={48} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state__title">{message}</h3>
      <p className="empty-state__subtitle">
        {onAdd ? 'Get started by adding your first task.' : 'Try adjusting your filters or search terms.'}
      </p>
      {onAdd && (
        <button className="btn btn-primary" onClick={onAdd} id="empty-state-add-btn">
          <Plus size={16} /> Add your first todo
        </button>
      )}
    </div>
  );
}
