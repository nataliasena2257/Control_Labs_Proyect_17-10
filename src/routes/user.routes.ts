import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
router.get('/', UserController.list);
router.post('/', UserController.create);
router.get('/:id', UserController.getById);
router.patch('/:id', UserController.patch);
router.delete('/:id', UserController.remove);
export default router;
