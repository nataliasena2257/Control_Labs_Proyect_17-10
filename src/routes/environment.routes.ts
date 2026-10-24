import { Router } from 'express';
import {
    getEnvironments,
    createEnvironment,
    updateEnvironment
} from '../controllers/environment.controller';

const router = Router();

router.get('/', getEnvironments);
router.post('/', createEnvironment);
router.patch('/:id', updateEnvironment);

export default router;
