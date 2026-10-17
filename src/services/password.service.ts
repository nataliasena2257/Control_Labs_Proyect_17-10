import { randomBytes, scryptSync } from 'node:crypto';

/** Genera un hash con sal aleatoria. Nunca guardamos la contraseña en texto plano. */
export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};
