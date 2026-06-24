import { useState, useEffect, useCallback } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../api/todoApi';

/**
 * useTodos — state management hook for the TodoList page.
 * Manages fetching, filtering, sorting, and all CRUD operations for the list.
 */
export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter/search/sort state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  /**
   * Fetch todos from the API with current filter/sort params.
   */
  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos({
        search,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        sortDir,
      });
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortBy, sortDir]);

  // Reload when any filter/sort changes
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  /**
   * Add a new todo.
   * @param {Object} data
   */
  const addTodo = useCallback(async (data) => {
    const newTodo = await createTodo(data);
    setTodos((prev) => [newTodo, ...prev]);
    return newTodo;
  }, []);

  /**
   * Edit an existing todo.
   * @param {string} id
   * @param {Object} data
   */
  const editTodo = useCallback(async (id, data) => {
    const updated = await updateTodo(id, data);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  /**
   * Remove a todo by ID.
   * @param {string} id
   */
  const removeTodo = useCallback(async (id) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Toggle the completed state of a todo.
   * @param {string} id
   * @param {boolean} completed
   */
  const toggleTodo = useCallback(async (id, completed) => {
    const updated = await updateTodo(id, { completed: !completed });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  return {
    todos,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    addTodo,
    editTodo,
    removeTodo,
    toggleTodo,
    reload: loadTodos,
  };
}
