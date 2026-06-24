/**
 * FilterBar — search input, status/priority dropdowns, and sort controls.
 *
 * @param {{
 *   search: string,
 *   onSearchChange: (val: string) => void,
 *   statusFilter: string,
 *   onStatusChange: (val: string) => void,
 *   priorityFilter: string,
 *   onPriorityChange: (val: string) => void,
 *   sortBy: string,
 *   onSortByChange: (val: string) => void,
 *   sortDir: string,
 *   onSortDirChange: (val: string) => void,
 * }} props
 */
export default function FilterBar({
  search, onSearchChange,
  statusFilter, onStatusChange,
  priorityFilter, onPriorityChange,
  sortBy, onSortByChange,
  sortDir, onSortDirChange,
}) {
  return (
    <div className="filter-bar" role="search" aria-label="Filter and search todos">
      {/* Search */}
      <div className="filter-bar__search">
        <span className="filter-bar__search-icon" aria-hidden="true">🔍</span>
        <input
          id="search-input"
          type="text"
          className="filter-bar__input"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search todos by title"
        />
        {search && (
          <button
            className="filter-bar__clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="filter-bar__group">
        <label htmlFor="status-filter" className="filter-bar__label">Status</label>
        <select
          id="status-filter"
          className="filter-bar__select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="filter-bar__group">
        <label htmlFor="priority-filter" className="filter-bar__label">Priority</label>
        <select
          id="priority-filter"
          className="filter-bar__select"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Sort Controls */}
      <div className="filter-bar__group">
        <label htmlFor="sort-by" className="filter-bar__label">Sort by</label>
        <select
          id="sort-by"
          className="filter-bar__select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="">Default</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {sortBy && (
        <button
          id="sort-dir-btn"
          className="filter-bar__sort-dir"
          onClick={() => onSortDirChange(sortDir === 'asc' ? 'desc' : 'asc')}
          aria-label={`Sort direction: ${sortDir === 'asc' ? 'ascending' : 'descending'}`}
          title="Toggle sort direction"
        >
          {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      )}
    </div>
  );
}
