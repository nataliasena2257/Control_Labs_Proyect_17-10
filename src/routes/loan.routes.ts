import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';

const router = Router();

// La ruta estática /search se define antes de /:id.
// GET /api/v1/loans
router.get('/', LoanController.getLoans);

// GET /api/v1/loans/search
router.get('/search', LoanController.getLoansByFilter);

// POST /api/v1/loans
router.post('/', LoanController.createLoan);

// PUT /api/v1/loans/:id/accept
router.put('/:id/accept', LoanController.acceptLoanInventory);

// GET /api/v1/loans/:id
router.get('/:id', LoanController.getLoanById);

export default router;