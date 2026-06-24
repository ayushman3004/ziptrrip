import { v4 as uuidv4 } from 'uuid';

/**
 * Todo factory function — creates a new Todo object with all fields and defaults.
 * @param {Object} data - Input data for the todo
 * @returns {Object} - A complete Todo object
 */
export function createTodo(data) {
  const now = new Date().toISOString();
  return {
    id: data.id || uuidv4(),
    title: data.title,
    description: data.description || '',
    priority: data.priority || 'medium',
    completed: data.completed !== undefined ? data.completed : false,
    dueDate: data.dueDate || null,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
}
