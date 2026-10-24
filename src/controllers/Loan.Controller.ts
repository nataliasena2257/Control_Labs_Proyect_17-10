import { Request, Response } from 'express';

export const getLoans = (req: Request, res: Response) => {
    res.status(501).json({
        status: 'error',
        message: 'Consulta de préstamos pendiente de implementar'
    });
};

export const searchLoans = (req: Request, res: Response) => {
    res.status(501).json({
        status: 'error',
        message: 'Búsqueda de préstamos pendiente de implementar'
    });
};

export const getLoanById = (req: Request, res: Response) => {
    res.status(501).json({
        status: 'error',
        message: 'Consulta del préstamo pendiente de implementar'
    });
};

export const acceptLoan = (req: Request, res: Response) => {
    res.status(501).json({
        status: 'error',
        message: 'Aceptación del préstamo pendiente de implementar'
    });
};