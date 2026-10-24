import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser} 
from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.patch('/:id/desactivar', deleteUser);

export default router;