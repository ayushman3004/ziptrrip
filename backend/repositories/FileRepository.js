import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { IRepository } from './IRepository.js';
import { createTodo } from '../models/Todo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'todos.json');

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
   * @param {Object} filters - { search, status, priority }
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}) {
    const todos = await this.#readFile();
    const { search, status, priority } = filters;

    return todos.filter((todo) => {
      if (search) {
        const term = search.toLowerCase();
        if (!todo.title.toLowerCase().includes(term)) return false;
      }
      if (status === 'active' && todo.completed) return false;
      if (status === 'completed' && !todo.completed) return false;
      if (priority && priority !== 'all' && todo.priority !== priority) return false;
      return true;
    });
  }

  /**
   * Find a single todo by ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const todos = await this.#readFile();
    return todos.find((t) => t.id === id) || null;
  }

  /**
   * Create and persist a new todo.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const todos = await this.#readFile();
    const newTodo = createTodo(data);
    todos.push(newTodo);
    await this.#writeFile(todos);
    return newTodo;
  }

  /**
   * Update an existing todo by ID. Merges fields and updates updatedAt.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  async update(id, data) {
    const todos = await this.#readFile();
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updated = {
      ...todos[index],
      ...data,
      id: todos[index].id,           // ID is immutable
      createdAt: todos[index].createdAt, // createdAt is immutable
      updatedAt: new Date().toISOString(),
    };
    todos[index] = updated;
    await this.#writeFile(todos);
    return updated;
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
}
