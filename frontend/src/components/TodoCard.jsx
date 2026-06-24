import { Check, Pencil, Trash2, Clock } from 'lucide-react';

/**
 * TodoCard — displays a single todo card styled as a mobile dashboard task.
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
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const priorityClass = `todo-card--${todo.priority || 'general'}`;


  return (
    <div 
      className={`todo-card ${priorityClass} ${todo.completed ? 'todo-card--completed' : ''}`}
      role="listitem"
    >
      {/* Custom Circular Checkbox */}
      <button
        className={`todo-card__checkbox ${todo.completed ? 'todo-card__checkbox--checked' : ''}`}
        onClick={() => onToggle(todo.id, todo.completed)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        id={`toggle-${todo.id}`}
      >
        {todo.completed && (
          <Check size={11} strokeWidth={3} />
        )}
      </button>

      {/* Content */}
      <div className="todo-card__content">
        <a
          href={`/todo.html?id=${todo.id}`}
          className={`todo-card__title ${todo.completed ? 'todo-card__title--done' : ''}`}
          id={`todo-link-${todo.id}`}
        >
          {todo.title}
        </a>

        {todo.description && (
          <p className="todo-card__description">{todo.description}</p>
        )}

        <div className="todo-card__meta">
          {todo.dueDate && (
            <span className="todo-card__due">
              <Clock size={11} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions tray (appears on hover) */}
      <div className="todo-card__actions">
        <button
          className="btn btn-icon"
          onClick={() => onEdit(todo)}
          aria-label={`Edit ${todo.title}`}
          title="Edit"
          id={`edit-${todo.id}`}
        >
          <Pencil size={12} />
        </button>
        <button
          className="btn btn-icon"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete ${todo.title}`}
          title="Delete"
          id={`delete-${todo.id}`}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
