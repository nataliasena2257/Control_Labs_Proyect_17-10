import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import {requestLogger} from './middlewares/logger.middleware';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';
import { error } from 'node:console';

const app = express();

app.use(cors());
app.use(requestLogger);
app.use(express.json());


// Endpoint para comprobar que la API está activa.
app.get('/api/v1/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1', apiRoutes);

app.use ((_req, res) => {
    res.status(404).json({ success: false, error: 'Esta Ruta No Esta Registrada. '});
});



app.use(globalErrorHandler);
export default app;
