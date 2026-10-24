import { Request, Response } from 'express';

interface Equipment {
    id: number;
    name: string;
    environmentId: number;
    technicalStatus: 'operativo' | 'mantenimiento' | 'da�ado';
    location: string;
}

const equipmentList: Equipment[] = [
    {
        id: 1,
        name: 'Computador 1',
        environmentId: 1,
        technicalStatus: 'operativo',
        location: 'Laboratorio 1'
    },
    {
        id: 2,
        name: 'Proyector 1',
        environmentId: 2,
        technicalStatus: 'mantenimiento',
        location: 'Laboratorio 2'
    }
];

export const getEquipment = (req: Request, res: Response) => {
    const { status } = req.query;

    const results = status
        ? equipmentList.filter(item => item.technicalStatus === status)
        : equipmentList;

    return res.status(200).json(results);
};

export const createEquipment = (req: Request, res: Response) => {
    const { name, environmentId, technicalStatus, location } = req.body;

    if (
        !name ||
        !Number.isInteger(environmentId) ||
        environmentId <= 0 ||
        !location
    ) {
        return res.status(400).json({
            message: 'El nombre, el ID del ambiente y la ubicaci�n son obligatorios.'
        });
    }

    const validStatuses = ['operativo', 'mantenimiento', 'da�ado'];

    if (
        technicalStatus !== undefined &&
        !validStatuses.includes(technicalStatus)
    ) {
        return res.status(400).json({
            message: 'El estado t�cnico debe ser operativo, mantenimiento o da�ado.'
        });
    }

    const equipment: Equipment = {
        id: equipmentList.length
            ? Math.max(...equipmentList.map(item => item.id)) + 1
            : 1,
        name,
        environmentId,
        technicalStatus: technicalStatus ?? 'operativo',
        location
    };

    equipmentList.push(equipment);

    return res.status(201).json(equipment);
};

export const updateEquipment = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const equipment = equipmentList.find(item => item.id === id);

    if (!equipment) {
        return res.status(404).json({
            message: 'Equipo no encontrado.'
        });
    }

    const { technicalStatus, location } = req.body;

    if (technicalStatus === undefined && location === undefined) {
        return res.status(400).json({
            message: 'Debes enviar el estado t�cnico o la ubicaci�n.'
        });
    }

    const validStatuses = ['operativo', 'mantenimiento', 'da�ado'];

    if (
        technicalStatus !== undefined &&
        !validStatuses.includes(technicalStatus)
    ) {
        return res.status(400).json({
            message: 'El estado t�cnico debe ser operativo, mantenimiento o da�ado.'
        });
    }

    if (
        location !== undefined &&
        (typeof location !== 'string' || !location.trim())
    ) {
        return res.status(400).json({
            message: 'La ubicaci�n debe ser un texto v�lido.'
        });
    }

    if (technicalStatus !== undefined) {
        equipment.technicalStatus = technicalStatus;
    }

    if (location !== undefined) {
        equipment.location = location.trim();
    }

    return res.status(200).json(equipment);
};
