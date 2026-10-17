import { Request, Response } from 'express';
import { ids, now, users } from '../data/store';
import { User, UserRole, RecordStatus } from '../models/control-labs.types';
import { hashPassword } from '../services/password.service';

const roles: UserRole[] = ['estudiante', 'docente', 'administrador'];
const statuses: RecordStatus[] = ['activo', 'inactivo'];
const publicUser = ({ passwordHash: _passwordHash, ...user }: User) => user;

export class UserController {
  static list = (_req: Request, res: Response): void => {
    res.status(200).json({ success: true, data: users.map(publicUser) });
  };

  static getById = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ success: false, message: 'El ID debe ser un entero positivo.' });
      return;
    }
    const user = users.find((item) => item.id === id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      return;
    }
    res.status(200).json({ success: true, data: publicUser(user) });
  };

  static create = (req: Request, res: Response): void => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const { name, email, role, password } = body;
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim() ||
        typeof password !== 'string' || password.length < 8 || !roles.includes(role as UserRole)) {
      res.status(400).json({ success: false, message: 'Envía name, email, role válido y password de al menos 8 caracteres.' });
      return;
    }
    if (users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())) {
      res.status(409).json({ success: false, message: 'Ya existe un usuario con ese correo.' });
      return;
    }
    const user: User = {
      id: ids.user(), name: name.trim(), email: email.trim().toLowerCase(), role: role as UserRole,
      status: 'activo', passwordHash: hashPassword(password), createdAt: now()
    };
    users.push(user);
    res.status(201).json({ success: true, data: publicUser(user) });
  };

  static patch = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const user = users.find((item) => item.id === id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ success: false, message: 'El ID debe ser un entero positivo.' });
      return;
    }
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    const allowed = ['role', 'status', 'password'];
    if (!Object.keys(body).length || Object.keys(body).some((key) => !allowed.includes(key))) {
      res.status(400).json({ success: false, message: 'PATCH acepta únicamente role, status y/o password.' });
      return;
    }
    if (body.role !== undefined && !roles.includes(body.role as UserRole)) {
      res.status(400).json({ success: false, message: 'Rol no válido.' });
      return;
    }
    if (body.status !== undefined && !statuses.includes(body.status as RecordStatus)) {
      res.status(400).json({ success: false, message: 'Estado no válido.' });
      return;
    }
    if (body.password !== undefined && (typeof body.password !== 'string' || body.password.length < 8)) {
      res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 8 caracteres.' });
      return;
    }
    if (body.role !== undefined) user.role = body.role as UserRole;
    if (body.status !== undefined) user.status = body.status as RecordStatus;
    if (body.password !== undefined) user.passwordHash = hashPassword(body.password as string);
    res.status(200).json({ success: true, data: publicUser(user) });
  };

  static remove = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const user = users.find((item) => item.id === id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ success: false, message: 'El ID debe ser un entero positivo.' });
      return;
    }
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      return;
    }
    user.status = 'inactivo';
    user.deletedAt = now();
    res.status(200).json({ success: true, message: 'Usuario dado de baja lógicamente.', data: publicUser(user) });
  };
}
