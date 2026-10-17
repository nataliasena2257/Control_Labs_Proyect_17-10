import { Request, Response } from 'express';
import { LoanService } from '../services/loan.service';

export class LoanController {
  public static createLoan = (_req: Request, res: Response): void => {
    // TODO de la sesión: conectar posteriormente con el servicio de creación.
    res.status(501).json({
      success: false,
      message: 'El registro de préstamos todavía no está implementado.'
    });
  };

  public static getLoansByFilter = (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: LoanService.getLoansByFilter(req.query)
    });
  };

  public static getLoanById = (req: Request, res: Response): void => {
    const { id } = req.params;

    // TODO: conectar posteriormente con la operación de consulta por ID.
    res.status(501).json({
      success: false,
      message: `La consulta del préstamo ${id} todavía no está implementada.`
    });
  };

  public static acceptLoanInventory = (req: Request, res: Response): void => {
    const { id } = req.params;

    // TODO: conectar posteriormente con la operación de aceptación.
    res.status(501).json({
      success: false,
      message: `La aceptación del préstamo ${id} todavía no está implementada.`
    });
  };
}
