import { Router } from 'express';
import { EnvironmentController } from '../controllers/environment.controller';

const router = Router();
router.get('/', EnvironmentController.list);
router.post('/', EnvironmentController.create);
router.patch('/:id', EnvironmentController.patch);
export default router;
