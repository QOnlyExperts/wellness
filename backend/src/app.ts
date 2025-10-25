import express, { Application, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer, Server as HttpServer } from 'http';
import { configSocket } from './application/services/socketService';
import config from './config';


import { errorHandler } from './presentation/middleware/errorHandler';

// Routers
import { groupImplementRouter } from './presentation/routers/GroupImplementRoutes';
import { implementRouter } from './presentation/routers/implementRoutes';
import { categoryRouter } from "./presentation/routers/CategoryRoutes";

import { roleRouter } from './presentation/routers/RoleRoutes';

// Crear la aplicación Express
const app: Application = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

// Configuración de CORS
app.use(cors(config.application.cors));

// Rutas

// Si luego habilitas tus rutas:
app.use('/api/v1', groupImplementRouter);
app.use('/api/v1', implementRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', roleRouter);
app.use(errorHandler);

app.use('/', (req: Request, res: Response) => {
  res.send('API v1 de Bienestar UCC funcionando 🚀');
});

const httpServer: HttpServer = createServer(app);

// Configurar socket
configSocket(httpServer);

export default httpServer;
