import { Router } from 'express';
import { TodoController } from '../controllers/todoController';

const router = Router();

// Todo routes
router.get('/', TodoController.getAll);
router.get('/:id', TodoController.getById);
router.post('/', TodoController.create);
router.patch('/:id', TodoController.update);
router.delete('/:id', TodoController.delete);
router.patch('/:id/toggle', TodoController.toggleCompleted);

export default router;
