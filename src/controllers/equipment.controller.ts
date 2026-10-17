import { Request, Response } from 'express';
import { environments, equipment, ids, now } from '../data/store';
import { EquipmentStatus } from '../models/control-labs.types';

const statuses: EquipmentStatus[] = ['operativo', 'mantenimiento', 'dañado'];

export class EquipmentController {
  static list = (req: Request, res: Response): void => {
    const environmentIdRaw = req.query.environmentId;
    if (environmentIdRaw === undefined) {
      res.status(200).json({ success: true, data: equipment });
      return;
    }
    const environmentId = Number(environmentIdRaw);
    if (!Number.isInteger(environmentId) || environmentId < 1) {
      res.status(400).json({ success: false, message: 'environmentId debe ser un entero positivo.' });
      return;
    }
    res.status(200).json({ success: true, data: equipment.filter((item) => item.environmentId === environmentId) });
  };

  static create = (req: Request, res: Response): void => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const { name, type, environmentId, location } = body;
    if (typeof name !== 'string' || !name.trim() || typeof type !== 'string' || !type.trim() ||
        !Number.isInteger(environmentId) || Number(environmentId) < 1 ||
        typeof location !== 'string' || !location.trim()) {
      res.status(400).json({ success: false, message: 'Envía name, type, environmentId entero positivo y location.' });
      return;
    }
    const environment = environments.find((item) => item.id === Number(environmentId));
    if (!environment) {
      res.status(400).json({ success: false, message: 'El ambiente indicado no existe.' });
      return;
    }
    const item = {
      id: ids.equipment(), name: name.trim(), type: type.trim(), environmentId: Number(environmentId),
      status: 'operativo' as EquipmentStatus, location: location.trim(), createdAt: now()
    };
    equipment.push(item);
    res.status(201).json({ success: true, data: item });
  };

  static patch = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const item = equipment.find((record) => record.id === id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ success: false, message: 'El ID debe ser un entero positivo.' }); return;
    }
    if (!item) {
      res.status(404).json({ success: false, message: 'Equipo no encontrado.' }); return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    const allowed = ['status', 'location', 'environmentId', 'name', 'type'];
    if (!Object.keys(body).length || Object.keys(body).some((key) => !allowed.includes(key))) {
      res.status(400).json({ success: false, message: 'PATCH acepta status, location, environmentId, name y/o type.' }); return;
    }
    if (body.status !== undefined && !statuses.includes(body.status as EquipmentStatus)) {
      res.status(400).json({ success: false, message: 'status debe ser operativo, mantenimiento o dañado.' }); return;
    }
    for (const key of ['name', 'type', 'location']) {
      if (body[key] !== undefined && (typeof body[key] !== 'string' || !(body[key] as string).trim())) {
        res.status(400).json({ success: false, message: `${key} debe ser texto no vacío.` }); return;
      }
    }
    if (body.environmentId !== undefined) {
      if (!Number.isInteger(body.environmentId) || Number(body.environmentId) < 1 ||
          !environments.some((environment) => environment.id === Number(body.environmentId))) {
        res.status(400).json({ success: false, message: 'environmentId debe identificar un ambiente existente.' }); return;
      }
    }
    if (body.status !== undefined) item.status = body.status as EquipmentStatus;
    if (body.location !== undefined) item.location = (body.location as string).trim();
    if (body.environmentId !== undefined) item.environmentId = Number(body.environmentId);
    if (body.name !== undefined) item.name = (body.name as string).trim();
    if (body.type !== undefined) item.type = (body.type as string).trim();
    res.status(200).json({ success: true, data: item });
  };
}
