import { Router } from 'express';
import { getEquipment, createEquipment, updateEquipment
} from '../controllers/equipment.controller';

const router = Router();

router.get('/', getEquipment);
router.post('/', createEquipment);
router.patch('/:id', updateEquipment);

export default router;
