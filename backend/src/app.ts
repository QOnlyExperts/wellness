import express, { Application, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { createServer, Server as HttpServer } from 'http';
import { SocketAdapter } from './infrastructure/adapters/SocketAdapter';
import config from './config';



import { authMiddleware } from "./presentation/http/middleware/authMiddleware";
import { errorHandler } from './presentation/http/middleware/errorHandler';

// Routers
import { groupImplementRouter } from './presentation/routers/GroupImplementRoutes';
import { implementRouter } from './presentation/routers/implementRoutes';
import { categoryRouter } from "./presentation/routers/CategoryRoutes";

import { roleRouter } from './presentation/routers/RoleRoutes';
import { loginRouter } from './presentation/routers/LoginRoutes';
import { registerRouter } from './presentation/routers/RegisterRoutes';
import { userRouter } from './presentation/routers/UserRouter';
import { requestRouter } from './presentation/routers/RequestRouter';
import { programRouter } from './presentation/routers/ProgramRoutes';

import dotenv from 'dotenv';
const API_CORS = process.env.API_CORS;

import path from 'path';
import { programRouterPublic } from './presentation/routers/ProgramRouterPublic';
import { authRoutes } from './presentation/routers/AuthRoutes';
// Crear la aplicación Express
const app: Application = express();


if (!API_CORS) {
  throw new Error("API_CORS no definida");
}

app.use(cors({
  origin: API_CORS,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}) as any);

// app.options("*", cors() as any);
// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

// Usar cookie-parser antes de tus rutas
app.use(cookieParser());

// Directorio public nombrado como resources

// Servir archivos estáticos subidos
app.use('/static', express.static(path.join(__dirname, '..', 'public', 'uploads','implement')));

// Middleware para archivos no encontrados
app.use('/static', (req, res) => {
  res.status(404).json({ message: 'Imagen no encontrada o extensión incorrecta' });
});

// Rutas publicas
app.use('/api/v1', loginRouter);
app.use('/api/v1', authRoutes)
app.use('/api/v1', registerRouter);
app.use('/api/v1', programRouterPublic);

// Para protección de autenticación en rutas
app.use(authMiddleware());

// Rutas privadas
app.use('/api/v1', requestRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', groupImplementRouter);
app.use('/api/v1', implementRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', roleRouter);
app.use('/api/v1', programRouter);
app.use(errorHandler);

app.use('/', (req: Request, res: Response) => {
  res.send('API v1 de Bienestar UCC funcionando 🚀');
});

const httpServer: HttpServer = createServer(app);

// Configurar socket
const socket = new SocketAdapter();
socket.config(httpServer);

export default httpServer;
