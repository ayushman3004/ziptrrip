import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import FilterBar from '../components/FilterBar';
import TodoCard from '../components/TodoCard';
import AddEditModal from '../components/AddEditModal';
import EmptyState from '../components/EmptyState';
import ThemeToggle from '../components/ThemeToggle';

/**
 * TodoList — Page 1, route "/".
 * Fetches and displays all todos with full filter/sort/CRUD capabilities.
 * Each page load fetches its own data independently.
 */
export default function TodoList() {
  const {
    todos, loading, error,
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    sortBy, setSortBy,
    sortDir, setSortDir,
    addTodo, editTodo, removeTodo, toggleTodo,
  } = useTodos();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id to confirm

  const openAddModal = () => { setEditingTodo(null); setModalOpen(true); };
  const openEditModal = (todo) => { setEditingTodo(todo); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTodo(null); };

  const handleSubmit = async (data) => {
    if (editingTodo) {
      await editTodo(editingTodo.id, data);
    } else {
      await addTodo(data);
    }
  };

  const handleDeleteClick = (id) => setDeleteConfirm(id);
  const confirmDelete = async () => {
    if (deleteConfirm) {
      await removeTodo(deleteConfirm);
      setDeleteConfirm(null);
    }
  };
  const cancelDelete = () => setDeleteConfirm(null);

  const hasFilters = search || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="page">
      {/* Header */}
      <header className="page-header">
        <div className="page-header__inner">
          <div className="page-header__brand">
            <span className="page-header__logo" aria-hidden="true">✅</span>
            <h1 className="page-header__title">Ziptrrip Todos</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <ThemeToggle />
            <button className="btn btn-primary" onClick={openAddModal} id="add-todo-btn">
              + Add Todo
            </button>
          </div>
        </div>
      </header>

      <main className="page-main">
        {/* Filter Bar */}
        <FilterBar
          search={search} onSearchChange={setSearch}
          statusFilter={statusFilter} onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter}
          sortBy={sortBy} onSortByChange={setSortBy}
          sortDir={sortDir} onSortDirChange={setSortDir}
        />

        {/* Stats bar */}
        {!loading && !error && (
          <div className="stats-bar">
            <span className="stats-bar__count">{todos.length} todo{todos.length !== 1 ? 's' : ''}</span>
            {todos.length > 0 && (
              <span className="stats-bar__completed">
                {todos.filter((t) => t.completed).length} completed
              </span>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-container" aria-live="polite" aria-label="Loading todos">
            <div className="spinner" />
            <p>Loading todos…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="error-banner" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && todos.length === 0 && (
          <EmptyState
            message={hasFilters ? 'No todos match your filters' : 'No todos yet'}
            onAdd={!hasFilters ? openAddModal : undefined}
          />
        )}

        {/* Todo list */}
        {!loading && !error && todos.length > 0 && (
          <div className="todo-list" role="list" aria-label="Todo items">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onEdit={openEditModal}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEditModal
          todo={editingTodo}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="modal modal--sm">
            <div className="modal__header">
              <h2 id="confirm-title" className="modal__title">🗑️ Delete Todo?</h2>
            </div>
            <p className="modal__body-text">
              This action cannot be undone. Are you sure you want to delete this todo?
            </p>
            <div className="modal__actions">
              <button className="btn btn-secondary" onClick={cancelDelete} id="cancel-delete-btn">
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete} id="confirm-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
