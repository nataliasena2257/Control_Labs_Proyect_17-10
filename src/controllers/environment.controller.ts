import { Request, Response } from 'express';

interface Environment {
    id: number;
    name: string;
    capacity: number;
    location: string;
    status: 'activo' | 'inactivo';
}

const environments: Environment[] = [
    { id: 1, name: 'Laboratorio 1', capacity: 25, location: 'Bloque A', status: 'activo' },
    { id: 2, name: 'Laboratorio 2', capacity: 20, location: 'Bloque B', status: 'activo' }
];

export const getEnvironments = (_req: Request, res: Response) => {
    res.status(200).json(environments);
};

export const createEnvironment = (req: Request, res: Response) => {
    const { name, capacity, location } = req.body;

    if (!name || !location || !Number.isInteger(capacity) || capacity <= 0) {
        return res.status(400).json({
            message: 'El nombre, la ubicaci�n y una capacidad entera positiva son obligatorios.'
        });
    }

    const environment: Environment = {
        id: environments.length
            ? Math.max(...environments.map(item => item.id)) + 1
            : 1,
        name,
        capacity,
        location,
        status: 'activo'
    };

    environments.push(environment);
    return res.status(201).json(environment);
};

export const updateEnvironment = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const environment = environments.find(item => item.id === id);

    if (!environment) {
        return res.status(404).json({ message: 'Ambiente no encontrado.' });
    }

    const { capacity, status } = req.body;

    if (capacity === undefined && status === undefined) {
        return res.status(400).json({
            message: 'Debes enviar la capacidad o el estado para actualizar.'
        });
    }

    if (capacity !== undefined &&
        (!Number.isInteger(capacity) || capacity <= 0)) {
        return res.status(400).json({
            message: 'La capacidad debe ser un entero positivo.'
        });
    }

    if (status !== undefined &&
        !['activo', 'inactivo'].includes(status)) {
        return res.status(400).json({
            message: 'El estado debe ser activo o inactivo.'
        });
    }

    if (capacity !== undefined) environment.capacity = capacity;
    if (status !== undefined) environment.status = status;

    return res.status(200).json(environment);
};
