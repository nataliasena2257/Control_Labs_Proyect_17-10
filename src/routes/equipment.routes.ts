import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';

const router = Router();
router.get('/', EquipmentController.list);
router.post('/', EquipmentController.create);
router.patch('/:id', EquipmentController.patch);
export default router;
