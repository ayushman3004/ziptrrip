import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { IRepository } from './IRepository.js';
import { createTodo } from '../models/Todo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'todos.json');

/** Fields tracked in history diffs (excludes internal metadata like history/updatedAt itself). */
const TRACKED_FIELDS = ['title', 'description', 'priority', 'completed', 'dueDate'];

/**
 * Build a changes map by comparing old and new values for tracked fields.
 * Only fields that actually changed are included.
 * @param {Object} oldTodo
 * @param {Object} newData - the partial update payload
 * @returns {Object} changes map: { fieldName: { from, to } }
 */
function buildChanges(oldTodo, newData) {
  const changes = {};
  for (const field of TRACKED_FIELDS) {
    if (field in newData && newData[field] !== oldTodo[field]) {
      changes[field] = { from: oldTodo[field], to: newData[field] };
    }
  }
  return changes;
}

/**
 * Strip the `history` field from a todo before returning it in list/single endpoints.
 * History is only returned via the dedicated /history endpoint.
 * @param {Object} todo
 * @returns {Object} todo without `history`
 */
function stripHistory(todo) {
  const { history, ...rest } = todo;
  return rest;
}

/**
 * FileRepository — Concrete implementation of IRepository.
 * All file I/O is isolated here. To swap storage (e.g., MongoDB),
 * create MongoRepository extending IRepository with the same method signatures.
 */
export class FileRepository extends IRepository {
  /**
   * Read all todos from the JSON file.
   * @returns {Promise<Array>}
   */
  async #readFile() {
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await this.#writeFile([]);
        return [];
      }
      throw err;
    }
  }

  /**
   * Write all todos to the JSON file.
   * @param {Array} todos
   * @returns {Promise<void>}
   */
  async #writeFile(todos) {
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
  }

  /**
   * Retrieve all todos, with optional filtering by status, priority, and search term.
   * The `history` field is stripped from all returned todos.
   * @param {Object} filters - { search, status, priority }
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}) {
    const todos = await this.#readFile();
    const { search, status, priority } = filters;

    return todos
      .filter((todo) => {
        if (search) {
          const term = search.toLowerCase();
          if (!todo.title.toLowerCase().includes(term)) return false;
        }
        if (status === 'active' && todo.completed) return false;
        if (status === 'completed' && !todo.completed) return false;
        if (priority && priority !== 'all' && todo.priority !== priority) return false;
        return true;
      })
      .map(stripHistory);
  }

  /**
   * Find a single todo by ID.
   * The `history` field is stripped from the returned todo.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const todos = await this.#readFile();
    const todo = todos.find((t) => t.id === id);
    return todo ? stripHistory(todo) : null;
  }

  /**
   * Create and persist a new todo.
   * Appends an initial 'created' history event.
   * @param {Object} data
   * @returns {Promise<Object>} The created todo (without history field).
   */
  async create(data) {
    const todos = await this.#readFile();
    const newTodo = createTodo(data);

    // Append the 'created' history event
    newTodo.history = [
      {
        event: 'created',
        timestamp: newTodo.createdAt,
        changes: {},
      },
    ];

    todos.push(newTodo);
    await this.#writeFile(todos);
    return stripHistory(newTodo);
  }

  /**
   * Update an existing todo by ID. Merges fields, records a history event,
   * and updates `updatedAt`.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object|null>} The updated todo (without history field).
   */
  async update(id, data) {
    const todos = await this.#readFile();
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const old = todos[index];
    const now = new Date().toISOString();

    // Diff tracked fields to build the changes record
    const changes = buildChanges(old, data);

    const updated = {
      ...old,
      ...data,
      id: old.id,           // ID is immutable
      createdAt: old.createdAt, // createdAt is immutable
      updatedAt: now,
      history: [
        ...(old.history || []),
        {
          event: 'updated',
          timestamp: now,
          changes,
        },
      ],
    };

    todos[index] = updated;
    await this.#writeFile(todos);
    return stripHistory(updated);
  }

  /**
   * Delete a todo by ID.
   * @param {string} id
   * @returns {Promise<boolean>} true if deleted, false if not found
   */
  async delete(id) {
    const todos = await this.#readFile();
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return false;
    todos.splice(index, 1);
    await this.#writeFile(todos);
    return true;
  }

  /**
   * Retrieve the change history for a todo by ID.
   * Returns the raw history array stored inside the todo.
   * @param {string} id
   * @returns {Promise<Array|null>} history array, or null if todo not found
   */
  async getHistory(id) {
    const todos = await this.#readFile();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return null;
    return todo.history || [];
  }

  /**
   * Retrieve all history events across every todo, sorted newest-first.
   * Each event is annotated with { todoId, todoTitle } for display.
   * @returns {Promise<Array>}
   */
  async getAllHistory() {
    const todos = await this.#readFile();
    const events = [];

    for (const todo of todos) {
      for (const entry of (todo.history || [])) {
        events.push({
          ...entry,
          todoId: todo.id,
          todoTitle: todo.title,
        });
      }
    }

    // Sort all events newest-first
    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return events;
  }
}
