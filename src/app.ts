import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', apiRoutes);

// Ruta raíz de práctica: el servidor existe, pero este recurso no está implementado.
app.get('/', (_req: Request, res: Response): void => {
  res.status(501).json({
    success: false,
    status: 501,
    message: 'La ruta raíz no está implementada. Usa /api/v1 para acceder a la API.'
  });
});

// Endpoint para comprobar que la API está activa.
app.get('/api/v1/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

export default app;
