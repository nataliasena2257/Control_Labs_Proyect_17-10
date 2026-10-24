
import { Router } from 'express';
import {
    getLoans,
    searchLoans,
    getLoanById,
    acceptLoan
} from '../controllers/loan.controller';

const router = Router();

router.get('/search', searchLoans);
router.get('/', getLoans);
router.get('/:id', getLoanById);
router.post('/:id/accept', acceptLoan);

export default router;
