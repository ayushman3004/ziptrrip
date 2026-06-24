import { Calendar, Check, Pencil, Trash2 } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

/**
 * TodoCard — displays a single todo row/card.
 * All logic is via callbacks from the parent.
 *
 * @param {{
 *   todo: Object,
 *   onToggle: (id: string, completed: boolean) => void,
 *   onEdit: (todo: Object) => void,
 *   onDelete: (id: string) => void,
 * }} props
 */
export default function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const formatDate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div className={`todo-card ${todo.completed ? 'todo-card--completed' : ''} ${isOverdue ? 'todo-card--overdue' : ''}`}
         role="listitem">
      {/* Checkbox */}
      <button
        className={`todo-card__checkbox ${todo.completed ? 'todo-card__checkbox--checked' : ''}`}
        onClick={() => onToggle(todo.id, todo.completed)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        id={`toggle-${todo.id}`}
      >
        {todo.completed && (
          <Check size={12} strokeWidth={3} color="white" />
        )}
      </button>

      {/* Content */}
      <div className="todo-card__content">
        {/* Title — navigates to detail page via window.location.href */}
        <a
          href={`/todo?id=${todo.id}`}
          className={`todo-card__title ${todo.completed ? 'todo-card__title--done' : ''}`}
          id={`todo-link-${todo.id}`}
        >
          {todo.title}
        </a>

        {todo.description && (
          <p className="todo-card__description">{todo.description}</p>
        )}

        <div className="todo-card__meta">
          <PriorityBadge priority={todo.priority} />
          {todo.dueDate && (
            <span className={`todo-card__due ${isOverdue ? 'todo-card__due--overdue' : ''}`}>
              <Calendar size={12} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {formatDate(todo.dueDate)}{isOverdue ? ' · Overdue' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="todo-card__actions">
        <button
          className="btn btn-icon btn-icon--edit"
          onClick={() => onEdit(todo)}
          aria-label={`Edit ${todo.title}`}
          title="Edit"
          id={`edit-${todo.id}`}
        >
          <Pencil size={14} />
        </button>
        <button
          className="btn btn-icon btn-icon--delete"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete ${todo.title}`}
          title="Delete"
          id={`delete-${todo.id}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
