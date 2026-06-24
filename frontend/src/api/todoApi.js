const BASE_URL = 'http://localhost:3001/api/todos';

/**
 * Helper to handle fetch responses and extract JSON.
 * Throws an error with the backend's error message on non-OK responses.
 */
async function handleResponse(res) {
  if (res.status === 204) return null; // No content
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return json;
}

/**
 * Fetch all todos with optional filters.
 * @param {Object} params - { search, status, priority, sortBy, sortDir }
 * @returns {Promise<Array>}
 */
export async function fetchTodos(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.priority && params.priority !== 'all') query.set('priority', params.priority);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortDir) query.set('sortDir', params.sortDir);

  const url = query.toString() ? `${BASE_URL}?${query}` : BASE_URL;
  const res = await fetch(url);
  const json = await handleResponse(res);
  return json.data;
}

/**
 * Fetch a single todo by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function fetchTodoById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  const json = await handleResponse(res);
  return json.data;
}

/**
 * Create a new todo.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function createTodo(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await handleResponse(res);
  return json.data;
}

/**
 * Update an existing todo.
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function updateTodo(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await handleResponse(res);
  return json.data;
}

/**
 * Delete a todo by ID.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  await handleResponse(res);
}

/**
 * Fetch the change history for a single todo by ID.
 * @param {string} id
 * @returns {Promise<Array>} array of history events
 */
export async function fetchTodoHistory(id) {
  const res = await fetch(`${BASE_URL}/${id}/history`);
  const json = await handleResponse(res);
  return json.data;
}

/**
 * Fetch all history events across every todo, sorted newest-first.
 * @returns {Promise<Array>} array of annotated history events (with todoId, todoTitle)
 */
export async function fetchAllHistory() {
  const res = await fetch(`${BASE_URL}/history`);
  const json = await handleResponse(res);
  return json.data;
}
