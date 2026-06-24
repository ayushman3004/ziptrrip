import { Router } from 'express';
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  getTodoHistory,
  getAllTodosHistory,
} from '../controllers/todoController.js';

const router = Router();

/**
 * Todo Routes — only defines endpoints and maps them to controller functions.
 * No business logic lives here.
 *
 * IMPORTANT: Static routes (/history) must be declared BEFORE parameterised
 * routes (/:id) so Express does not mistake 'history' for an ID value.
 */
router.post('/', createTodo);
router.get('/', getAllTodos);
router.get('/history', getAllTodosHistory);      // Global history  (static — before /:id)
router.get('/:id/history', getTodoHistory);      // Per-todo history
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
