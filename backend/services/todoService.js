import { FileRepository } from '../repositories/FileRepository.js';

const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Custom error class for validation failures (maps to HTTP 400).
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

/**
 * Custom error class for missing resources (maps to HTTP 404).
 */
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

// Single repository instance for the service (Dependency Inversion — injected via constructor in a real DI container)
const repository = new FileRepository();

/**
 * TodoService — contains all business logic and validation.
 * It is the only layer that calls the repository.
 */
export const todoService = {
  /**
   * Retrieve all todos with optional filters and sorting.
   * @param {Object} queryParams - { search, status, priority, sortBy, sortDir }
   * @returns {Promise<Array>}
   */
  async getAllTodos({ search, status, priority, sortBy, sortDir } = {}) {
    const todos = await repository.findAll({ search, status, priority });

    // Sorting logic
    if (sortBy === 'dueDate') {
      todos.sort((a, b) => {
        const da = a.dueDate ? new Date(a.dueDate) : Infinity;
        const db = b.dueDate ? new Date(b.dueDate) : Infinity;
        return sortDir === 'desc' ? db - da : da - db;
      });
    } else if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      todos.sort((a, b) => {
        const diff = order[a.priority] - order[b.priority];
        return sortDir === 'desc' ? -diff : diff;
      });
    }

    return todos;
  },

  /**
   * Retrieve a single todo by ID. Throws NotFoundError if not found.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getTodoById(id) {
    if (!id) throw new ValidationError('ID is required');
    const todo = await repository.findById(id);
    if (!todo) throw new NotFoundError(`Todo with id "${id}" not found`);
    return todo;
  },

  /**
   * Create a new todo after validating input.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async createTodo(data) {
    const errors = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('title is required and must be a non-empty string');
    }

    if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
      errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }

    if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
      errors.push('dueDate must be a valid ISO date string');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('; '));
    }

    return repository.create({
      title: data.title.trim(),
      description: data.description ? String(data.description).trim() : '',
      priority: data.priority || 'medium',
      completed: false,
      dueDate: data.dueDate || null,
    });
  },

  /**
   * Update an existing todo after validating input.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateTodo(id, data) {
    if (!id) throw new ValidationError('ID is required');

    const errors = [];

    if (data.title !== undefined) {
      if (typeof data.title !== 'string' || data.title.trim() === '') {
        errors.push('title must be a non-empty string');
      }
    }

    if (data.priority !== undefined && !VALID_PRIORITIES.includes(data.priority)) {
      errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }

    if (data.dueDate !== undefined && data.dueDate !== null && isNaN(Date.parse(data.dueDate))) {
      errors.push('dueDate must be a valid ISO date string or null');
    }

    if (data.completed !== undefined && typeof data.completed !== 'boolean') {
      errors.push('completed must be a boolean');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('; '));
    }

    // Check existence before update
    const existing = await repository.findById(id);
    if (!existing) throw new NotFoundError(`Todo with id "${id}" not found`);

    // Only allow known fields to be updated
    const allowed = {};
    if (data.title !== undefined) allowed.title = data.title.trim();
    if (data.description !== undefined) allowed.description = String(data.description).trim();
    if (data.priority !== undefined) allowed.priority = data.priority;
    if (data.completed !== undefined) allowed.completed = data.completed;
    if (data.dueDate !== undefined) allowed.dueDate = data.dueDate;

    return repository.update(id, allowed);
  },

  /**
   * Delete a todo by ID. Throws NotFoundError if not found.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteTodo(id) {
    if (!id) throw new ValidationError('ID is required');
    const deleted = await repository.delete(id);
    if (!deleted) throw new NotFoundError(`Todo with id "${id}" not found`);
  },

  /**
   * Retrieve the change history for a todo by ID.
   * Throws NotFoundError if the todo does not exist.
   * @param {string} id
   * @returns {Promise<Array>} array of history events
   */
  async getTodoHistory(id) {
    if (!id) throw new ValidationError('ID is required');
    const history = await repository.getHistory(id);
    if (history === null) throw new NotFoundError(`Todo with id "${id}" not found`);
    return history;
  },

  /**
   * Retrieve all history events across every todo, sorted newest-first.
   * @returns {Promise<Array>}
   */
  async getAllTodosHistory() {
    return repository.getAllHistory();
  },
};
