import { Router } from 'express';
import todoRoutes from './todos';
import categoryRoutes from './categories';
import tagRoutes from './tags';

const router = Router();

// API routes
router.use('/todos', todoRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);

export default router;
