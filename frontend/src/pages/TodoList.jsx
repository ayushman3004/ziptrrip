import { useState } from 'react';
import { Plus, Trash2, History, Search, X, Sliders, ArrowUp, ArrowDown } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import TodoCard from '../components/TodoCard';
import AddEditModal from '../components/AddEditModal';
import EmptyState from '../components/EmptyState';
import ThemeToggle from '../components/ThemeToggle';

/**
 * TodoList — Page 1, route "/".
 * Implements a premium side-by-side dashboard layout inspired by reference mobile mockups.
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
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);

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

  // Generate 7 days centered around today
  const getWeeklyDays = () => {
    const days = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weeklyDays = getWeeklyDays();

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const handleDayClick = (day) => {
    if (selectedDateFilter && isSameDay(selectedDateFilter, day)) {
      setSelectedDateFilter(null);
    } else {
      setSelectedDateFilter(day);
    }
  };

  // Filter tasks based on priority category card or weekly date filter
  const displayedTodos = todos.filter((todo) => {
    if (!selectedDateFilter) return true;
    if (!todo.dueDate) return false;
    return isSameDay(new Date(todo.dueDate), selectedDateFilter);
  });

  const activeTodos = displayedTodos.filter((t) => !t.completed);

  // Category counts based on priority
  const highCount = todos.filter((t) => t.priority === 'high' && !t.completed).length;
  const mediumCount = todos.filter((t) => t.priority === 'medium' && !t.completed).length;
  const lowCount = todos.filter((t) => t.priority === 'low' && !t.completed).length;

  const handleCategoryToggle = (priority) => {
    if (priorityFilter === priority) {
      setPriorityFilter('all');
    } else {
      setPriorityFilter(priority);
    }
  };

  // Schedule Timeline mapping
  const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];

  const getTasksForTimeSlot = (slotTimeStr, targetDate) => {
    const dateToCheck = targetDate || new Date();
    const dayTodos = todos.filter((todo) => {
      if (todo.completed) return false;
      if (!todo.dueDate) return false;
      return isSameDay(new Date(todo.dueDate), dateToCheck);
    });

    return dayTodos.filter((todo) => {
      const hour = new Date(todo.dueDate).getHours();
      if (slotTimeStr === '09:00 AM') return hour < 11;
      if (slotTimeStr === '11:00 AM') return hour >= 11 && hour < 13;
      if (slotTimeStr === '01:00 PM') return hour >= 13 && hour < 15;
      if (slotTimeStr === '03:00 PM') return hour >= 15 && hour < 17;
      if (slotTimeStr === '05:00 PM') return hour >= 17;
      return false;
    });
  };

  const getDayNameShort = (day) => {
    return day.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const hasFilters = search || statusFilter !== 'all' || priorityFilter !== 'all' || selectedDateFilter;

  const resetAllFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSelectedDateFilter(null);
  };

  const formattedHeaderDate = (selectedDateFilter || new Date()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page">
      <main className="dashboard-layout">
        
        {/* LEFT COLUMN (Screen 1 Dashboard View) */}
        <section className="dashboard-panel dashboard-panel--left">
          {/* Logo-free Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="page-header__title" style={{ margin: 0 }}>Todos APP</h1>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <ThemeToggle />
              <button className="btn btn-primary" onClick={openAddModal} id="add-todo-btn" style={{ padding: '0.6rem 1rem', borderRadius: '24px' }}>
                <Plus size={16} /> Add Todo
              </button>
            </div>
          </div>

          {/* Search Pill Container */}
          <div className="search-pill-container">
            <div className="search-pill-box">
              <span className="search-pill-box__icon">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="search-pill-box__input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search todos"
              />
              {search && (
                <button className="search-pill-box__clear" onClick={() => setSearch('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              className={`filter-circle-btn ${filtersExpanded ? 'filter-circle-btn--active' : ''}`}
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              aria-label="Toggle filter options"
              aria-expanded={filtersExpanded}
            >
              <Sliders size={18} />
            </button>
          </div>

          {/* Expandable Filter Panel */}
          {filtersExpanded && (
            <div className="expandable-filter-panel" role="search" aria-label="Expanded filter panel">
              {/* Status */}
              <div className="filter-bar__group">
                <label htmlFor="status-filter" className="filter-bar__label">Status</label>
                <select
                  id="status-filter"
                  className="filter-bar__select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Priority select */}
              <div className="filter-bar__group">
                <label htmlFor="priority-filter" className="filter-bar__label">Priority</label>
                <select
                  id="priority-filter"
                  className="filter-bar__select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="filter-bar__group">
                <label htmlFor="sort-by" className="filter-bar__label">Sort by</label>
                <select
                  id="sort-by"
                  className="filter-bar__select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>

              {/* Sort Direction */}
              {sortBy && (
                <button
                  id="sort-dir-btn"
                  className="filter-bar__sort-dir"
                  style={{ alignSelf: 'flex-end', height: '40px', width: '40px', borderRadius: '12px' }}
                  onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                  aria-label={`Sort direction: ${sortDir === 'asc' ? 'ascending' : 'descending'}`}
                >
                  {sortDir === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </button>
              )}
            </div>
          )}

          {/* Categories / Priority Quick Filter Grid */}
          <div className="categories-section">
            <h2 className="categories-section__title">Categories</h2>
            <div className="categories-grid" role="group" aria-label="Priority Categories">
              {/* High Card */}
              <button
                className={`category-card category-card--high ${priorityFilter === 'high' ? 'category-card--active' : ''}`}
                onClick={() => handleCategoryToggle('high')}
              >
                <div>
                  <div className="category-card__name">High Priority</div>
                  <div className="category-card__count">{highCount} tasks</div>
                </div>
                <div className="category-card__illustration" aria-hidden="true">
                  <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="45" r="22" fill="var(--pastel-high-text)" opacity="0.15" />
                    <path d="M50 20c-15 0-25 10-25 25 0 8 4 14 10 18l-3 15h36l-3-15c6-4 10-10 10-18 0-15-10-25-25-25z" fill="var(--pastel-high-text)" opacity="0.6" />
                    <circle cx="50" cy="45" r="18" fill="var(--pastel-high)" />
                    <circle cx="43" cy="43" r="2.5" fill="var(--pastel-high-text)" />
                    <circle cx="57" cy="43" r="2.5" fill="var(--pastel-high-text)" />
                    <path d="M46 52s4 3 8 0" stroke="var(--pastel-high-text)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              {/* Medium Card */}
              <button
                className={`category-card category-card--medium ${priorityFilter === 'medium' ? 'category-card--active' : ''}`}
                onClick={() => handleCategoryToggle('medium')}
              >
                <div>
                  <div className="category-card__name">Medium Priority</div>
                  <div className="category-card__count">{mediumCount} tasks</div>
                </div>
                <div className="category-card__illustration" aria-hidden="true">
                  <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="45" r="22" fill="var(--pastel-medium-text)" opacity="0.15" />
                    <path d="M28 35c0-10 10-15 22-15s22 5 22 15c0 10-4 15-4 15l-3 15H35l-3-15s-4-5-4-15z" fill="var(--pastel-medium-text)" opacity="0.6" />
                    <circle cx="50" cy="45" r="18" fill="var(--pastel-medium)" />
                    <rect x="36" y="40" width="10" height="8" rx="2" stroke="var(--pastel-medium-text)" strokeWidth="2.5" fill="none" />
                    <rect x="54" y="40" width="10" height="8" rx="2" stroke="var(--pastel-medium-text)" strokeWidth="2.5" fill="none" />
                    <line x1="46" y1="44" x2="54" y2="44" stroke="var(--pastel-medium-text)" strokeWidth="2.5" />
                    <circle cx="41" cy="44" r="1.5" fill="var(--pastel-medium-text)" />
                    <circle cx="59" cy="44" r="1.5" fill="var(--pastel-medium-text)" />
                    <path d="M46 54s4 2 8 0" stroke="var(--pastel-medium-text)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              {/* Low Card */}
              <button
                className={`category-card category-card--low ${priorityFilter === 'low' ? 'category-card--active' : ''}`}
                onClick={() => handleCategoryToggle('low')}
              >
                <div>
                  <div className="category-card__name">Low Priority</div>
                  <div className="category-card__count">{lowCount} tasks</div>
                </div>
                <div className="category-card__illustration" aria-hidden="true">
                  <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="40" fill="var(--pastel-low)" stroke="var(--pastel-low-border)" strokeWidth="4" />
                    <path d="M35 50l10 10 20-20" stroke="var(--pastel-low-text)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Ongoing Tasks View */}
          <div className="ongoing-section">
            <div className="ongoing-header">
              <span className="ongoing-header__title">Ongoing tasks</span>
              {hasFilters && (
                <button className="ongoing-header__see-all" onClick={resetAllFilters}>
                  Clear all
                </button>
              )}
            </div>

            {loading && (
              <div className="loading-container" style={{ padding: '2rem 0' }}>
                <div className="spinner" />
                <p style={{ marginTop: '0.75rem' }}>Loading todos…</p>
              </div>
            )}

            {!loading && error && (
              <div className="error-banner" role="alert">
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && activeTodos.length === 0 && (
              <EmptyState
                message={hasFilters ? 'No active tasks match your filters' : 'No active tasks'}
                onAdd={!hasFilters ? openAddModal : undefined}
              />
            )}

            {!loading && !error && activeTodos.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }} role="list" aria-label="Ongoing tasks">
                {activeTodos.map((todo) => (
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
          </div>
        </section>

        {/* RIGHT COLUMN (Screen 2 Schedule / Time View) */}
        <section className="dashboard-panel dashboard-panel--right">
          {/* Header Strip with History Button */}
          <div className="dashboard-header-right">
            <div>
              <h2 className="dashboard-header-right__title">{formattedHeaderDate}</h2>
              <p className="dashboard-header-right__subtitle">
                {todos.filter((t) => !t.completed).length} tasks remaining
              </p>
            </div>
            <a href="/history.html" className="dashboard-header-right__icon" title="View history page">
              <History size={20} />
            </a>
          </div>

          {/* Interactive Weekly Calendar Strip */}
          <div className="weekly-strip" role="group" aria-label="Calendar weekly strip">
            {weeklyDays.map((day, idx) => {
              const name = getDayNameShort(day);
              const num = day.getDate();
              const isSelected = selectedDateFilter
                ? isSameDay(selectedDateFilter, day)
                : isSameDay(new Date(), day);

              return (
                <button
                  key={idx}
                  className={`weekly-day ${isSelected ? 'weekly-day--selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                  aria-label={`View tasks for ${day.toDateString()}`}
                >
                  <span className="weekly-day__name">{name}</span>
                  <span className="weekly-day__num">{num}</span>
                  {isSelected && <span className="weekly-day__dot" />}
                </button>
              );
            })}
          </div>

          {/* Timeline scheduler list */}
          <div className="timeline-section">
            <h3 className="timeline-section__title">Today's Schedule</h3>
            <div className="timeline-container">
              {timeSlots.map((slot) => {
                const targetDate = selectedDateFilter || new Date();
                const slotTasks = getTasksForTimeSlot(slot, targetDate);

                return (
                  <div key={slot} className="timeline-slot">
                    <span className="timeline-time">{slot}</span>
                    <div className="timeline-events">
                      {slotTasks.length > 0 ? (
                        slotTasks.map((todo) => (
                          <TodoCard
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onEdit={openEditModal}
                            onDelete={handleDeleteClick}
                          />
                        ))
                      ) : (
                        <div style={{ height: '36px' }} /> // Empty placeholder line to match mock style
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

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
              <h2 id="confirm-title" className="modal__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trash2 size={18} className="text-danger" /> Delete Todo?
              </h2>
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
