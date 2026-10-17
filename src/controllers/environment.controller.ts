import { Request, Response } from 'express';
import { environments, ids, now } from '../data/store';
import { RecordStatus } from '../models/control-labs.types';

const statuses: RecordStatus[] = ['activo', 'inactivo'];

export class EnvironmentController {
  static list = (_req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: environments });
  };

  static create = (req: Request, res: Response): void => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const { name, capacity, location } = body;
    if (typeof name !== 'string' || !name.trim() || !Number.isInteger(capacity) || Number(capacity) < 1 ||
        typeof location !== 'string' || !location.trim()) {
      res.status(400).json({ success: false, message: 'Envía name, capacity (entero positivo) y location.' });
      return;
    }
    const environment = {
      id: ids.environment(), name: name.trim(), capacity: Number(capacity), location: location.trim(),
      status: 'activo' as RecordStatus, createdAt: now()
    };
    environments.push(environment);
    res.status(201).json({ success: true, data: environment });
  };

  static patch = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const environment = environments.find((item) => item.id === id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ success: false, message: 'El ID debe ser un entero positivo.' });
      return;
    }
    if (!environment) {
      res.status(404).json({ success: false, message: 'Ambiente no encontrado.' });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    const allowed = ['name', 'capacity', 'location', 'status'];
    if (!Object.keys(body).length || Object.keys(body).some((key) => !allowed.includes(key))) {
      res.status(400).json({ success: false, message: 'PATCH acepta name, capacity, location y/o status.' });
      return;
    }
    if (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) {
      res.status(400).json({ success: false, message: 'name debe ser texto no vacío.' }); return;
    }
    if (body.capacity !== undefined && (!Number.isInteger(body.capacity) || Number(body.capacity) < 1)) {
      res.status(400).json({ success: false, message: 'capacity debe ser un entero positivo.' }); return;
    }
    if (body.location !== undefined && (typeof body.location !== 'string' || !body.location.trim())) {
      res.status(400).json({ success: false, message: 'location debe ser texto no vacío.' }); return;
    }
    if (body.status !== undefined && !statuses.includes(body.status as RecordStatus)) {
      res.status(400).json({ success: false, message: 'status debe ser activo o inactivo.' }); return;
    }
    if (body.name !== undefined) environment.name = (body.name as string).trim();
    if (body.capacity !== undefined) environment.capacity = Number(body.capacity);
    if (body.location !== undefined) environment.location = (body.location as string).trim();
    if (body.status !== undefined) environment.status = body.status as RecordStatus;
    res.status(200).json({ success: true, data: environment });
  };
}
