import { Request, Response } from 'express';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'estudiante' | 'docente' | 'administrador';
    status: 'activo' | 'inactivo';
}

const users: User[] = [
    {
        id: 1,
        name: 'Ana Pérez',
        email: 'ana@controllabs.com',
        role: 'estudiante',
        status: 'activo'
    },
    {
        id: 2,
        name: 'Carlos Gómez',
        email: 'carlos@controllabs.com',
        role: 'docente',
        status: 'activo'
    }
];

export const getUsers = (_req: Request, res: Response) => {
    return res.status(200).json(users);
};

export const getUserById = (req: Request, res: Response) => {
    const user = users.find(
        user => user.id === Number(req.params.id)
    );

    if (!user) {
        return res.status(404).json({
            message: 'Usuario no encontrado'
        });
    }

    return res.status(200).json(user);
};

export const createUser = (req: Request, res: Response) => {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({
            message: 'Nombre, correo y rol son obligatorios'
        });
    }

    const validRoles = ['estudiante', 'docente', 'administrador'];

    if (!validRoles.includes(role)) {
        return res.status(400).json({
            message: 'El rol no es válido'
        });
    }

    const emailExists = users.some(
        user => user.email.toLowerCase() === String(email).toLowerCase()
    );

    if (emailExists) {
        return res.status(409).json({
            message: 'El correo ya está registrado'
        });
    }

    const newUser: User = {
        id: users.length
            ? Math.max(...users.map(user => user.id)) + 1
            : 1,
        name,
        email,
        role,
        status: 'activo'
    };

    users.push(newUser);

    return res.status(201).json(newUser);
};
export const updateUser = (req: Request, res: Response) => {
    const user = users.find(user => user.id === Number(req.params.id));

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { role, status, password } = req.body;

    if (role !== undefined) {
        if (!['estudiante', 'docente', 'administrador'].includes(role)) {
            return res.status(400).json({ message: 'El rol no es válido' });
        }
        user.role = role;
    }

    if (status !== undefined) {
        if (!['activo', 'inactivo'].includes(status)) {
            return res.status(400).json({ message: 'El estado no es válido' });
        }
        user.status = status;
    }

    if (password !== undefined &&
        (typeof password !== 'string' || password.length < 8)) {
        return res.status(400).json({
            message: 'La contraseña debe tener al menos 8 caracteres'
        });
    }

    return res.status(200).json({
        message: 'Usuario actualizado correctamente',
        user
    });
};

export const deleteUser = (req: Request, res: Response) => {
    const user = users.find(user => user.id === Number(req.params.id));

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.status = 'inactivo';

    return res.status(200).json({
        message: 'Usuario desactivado correctamente',
        user
    });
};
