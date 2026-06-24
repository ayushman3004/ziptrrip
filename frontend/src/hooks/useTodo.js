import { useState, useEffect, useCallback } from 'react';
import { fetchTodoById, updateTodo, deleteTodo, fetchTodoHistory } from '../api/todoApi';

/**
 * useTodo — state management hook for the TodoDetail page.
 * Fetches a single todo by ID, and provides update/delete/toggle actions.
 * Also provides lazy history loading via loadHistory().
 *
 * @param {string} id - Todo ID from URL query param
 */
export function useTodo(id) {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // History state — loaded lazily on first open of the History section
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  /**
   * Fetch the todo from the API on mount or when ID changes.
   */
  useEffect(() => {
    if (!id) {
      setError('No todo ID provided in the URL');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTodoById(id);
        if (!cancelled) setTodo(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load todo');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [id]);

  /**
   * Update the current todo.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  const updateCurrentTodo = useCallback(async (data) => {
    const updated = await updateTodo(id, data);
    setTodo(updated);
    // Invalidate cached history so it reloads on next open
    setHistoryLoaded(false);
    setHistory([]);
    return updated;
  }, [id]);

  /**
   * Delete the current todo and redirect to the list page (MPA: index.html).
   */
  const deleteCurrentTodo = useCallback(async () => {
    await deleteTodo(id);
    window.location.href = '/';
  }, [id]);

  /**
   * Toggle the completed state of the current todo.
   */
  const toggleCurrentTodo = useCallback(async () => {
    if (!todo) return;
    const updated = await updateTodo(id, { completed: !todo.completed });
    setTodo(updated);
    // Invalidate cached history
    setHistoryLoaded(false);
    setHistory([]);
  }, [id, todo]);

  /**
   * Lazily load the todo's change history.
   * Only fetches from the API on first call; subsequent calls use cached state.
   */
  const loadHistory = useCallback(async () => {
    if (historyLoaded) return; // already fetched
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const data = await fetchTodoHistory(id);
      setHistory(data);
      setHistoryLoaded(true);
    } catch (err) {
      setHistoryError(err.message || 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }, [id, historyLoaded]);

  return {
    todo,
    loading,
    error,
    updateCurrentTodo,
    deleteCurrentTodo,
    toggleCurrentTodo,
    history,
    historyLoading,
    historyError,
    loadHistory,
  };
}
