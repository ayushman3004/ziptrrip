import { todoService } from '../services/todoService.js';

/**
 * TodoController — handles HTTP req/res only.
 * Delegates all logic to the service layer and sends JSON responses.
 * Express 5 automatically catches async errors and forwards to errorHandler.
 */

/**
 * POST /api/todos
 * Create a new todo.
 */
export async function createTodo(req, res) {
  const todo = await todoService.createTodo(req.body);
  res.status(201).json({
    success: true,
    data: todo,
  });
}

/**
 * GET /api/todos
 * Get all todos with optional ?search, ?status, ?priority, ?sortBy, ?sortDir
 */
export async function getAllTodos(req, res) {
  const { search, status, priority, sortBy, sortDir } = req.query;
  const todos = await todoService.getAllTodos({ search, status, priority, sortBy, sortDir });
  res.status(200).json({
    success: true,
    count: todos.length,
    data: todos,
  });
}

/**
 * GET /api/todos/:id
 * Get a single todo by ID.
 */
export async function getTodoById(req, res) {
  const todo = await todoService.getTodoById(req.params.id);
  res.status(200).json({
    success: true,
    data: todo,
  });
}

/**
 * PUT /api/todos/:id
 * Update a todo by ID.
 */
export async function updateTodo(req, res) {
  const todo = await todoService.updateTodo(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: todo,
  });
}

/**
 * DELETE /api/todos/:id
 * Delete a todo by ID.
 */
export async function deleteTodo(req, res) {
  await todoService.deleteTodo(req.params.id);
  res.status(204).send();
}

/**
 * GET /api/todos/:id/history
 * Get the change history for a single todo.
 */
export async function getTodoHistory(req, res) {
  const history = await todoService.getTodoHistory(req.params.id);
  res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
}

/**
 * GET /api/todos/history
 * Get all history events across every todo, sorted newest-first.
 */
export async function getAllTodosHistory(req, res) {
  const history = await todoService.getAllTodosHistory();
  res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
}
