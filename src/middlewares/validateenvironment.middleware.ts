import { Request, Response, NextFunction } from 'express';
import { ICreateEnvironmentDTO } from '../dtos/environment.dto';

const isCreateEnvironmentDTO = (value: unknown): value is ICreateEnvironmentDTO => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const environment = value as Record<string, unknown>;
    return (
        typeof environment.nombre === 'string' && environment.nombre.trim() !== '' &&
        typeof environment.ubicacion === 'string' && environment.ubicacion.trim() !== '' &&
        typeof environment.descripcion === 'string' && environment.descripcion.trim() !== ''
    );
};

export const validateLoanPayload = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body: unknown = req.body;
    if (!isCreateEnvironmentDTO(body)) {
        res.status(400).json({
            success: false,
            error: 'Datos del Envio inválidos.'
        });
        return;
    }
    next();
};