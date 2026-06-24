import { Router } from 'express';
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';

const router = Router();

/**
 * Todo Routes — only defines endpoints and maps them to controller functions.
 * No business logic lives here.
 */
router.post('/', createTodo);
router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
