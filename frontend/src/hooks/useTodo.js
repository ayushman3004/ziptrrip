import { useState, useEffect, useCallback } from 'react';
import { fetchTodoById, updateTodo, deleteTodo } from '../api/todoApi';

/**
 * useTodo — state management hook for the TodoDetail page.
 * Fetches a single todo by ID, and provides update/delete/toggle actions.
 * Each detail page fetches its own data independently (no shared global state).
 *
 * @param {string} id - Todo ID from URL query param
 */
export function useTodo(id) {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return updated;
  }, [id]);

  /**
   * Delete the current todo and redirect to the list page.
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
  }, [id, todo]);

  return {
    todo,
    loading,
    error,
    updateCurrentTodo,
    deleteCurrentTodo,
    toggleCurrentTodo,
  };
}
