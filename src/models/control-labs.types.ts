export type UserRole = 'estudiante' | 'docente' | 'administrador';
export type RecordStatus = 'activo' | 'inactivo';
export type EquipmentStatus = 'operativo' | 'mantenimiento' | 'dañado';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: RecordStatus;
  passwordHash: string;
  createdAt: string;
  deletedAt?: string;
}

export interface Environment {
  id: number;
  name: string;
  capacity: number;
  location: string;
  status: RecordStatus;
  createdAt: string;
}

export interface Equipment {
  id: number;
  name: string;
  type: string;
  environmentId: number;
  status: EquipmentStatus;
  location: string;
  createdAt: string;
}

export interface Loan {
  id: number;
  room?: string;
  requesterName?: string;
  item?: string;
  startDate?: string;
  endDate?: string;
  status: 'PENDING' | 'ACCEPTED';
  createdAt: string;
}
