import { Environment, Equipment, User } from '../models/control-labs.types';

/** Almacenamiento temporal de desarrollo: los registros desaparecen al reiniciar el proceso. */
export const users: User[] = [];
export const environments: Environment[] = [];
export const equipment: Equipment[] = [];

let nextUserId = 1;
let nextEnvironmentId = 1;
let nextEquipmentId = 1;

export const ids = {
  user: (): number => nextUserId++,
  environment: (): number => nextEnvironmentId++,
  equipment: (): number => nextEquipmentId++
};

export const now = (): string => new Date().toISOString();
