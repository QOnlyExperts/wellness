// src/infrastructure/adapters/SocketAdapter.ts

import { Server, Socket } from "socket.io";
import cookie from "cookie";


import {
  resolveJwtTokenService,
  resolveGetUserByIdUseCase,
  resolveRegisterRequestUseCase,
  resolveUpdateRequestUseCase
} from "../../composition/compositionRoot";

import { JwtService } from "../services/JwtService";
import { GetUserByIdUseCase } from "../../application/use-cases/users/GetUserByIdUseCase";
import { RegisterRequestUseCase } from "../../application/use-cases/request/register/RegisterRequestUseCase";

import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/DomainErrors";
import { UpdateRequestUseCase } from "../../application/use-cases/request/register/UpdateRequestUseCase";
import { RequestStatus } from "../../domain/enums/RequestStatus";
import { ImplementStatus } from "../../domain/enums/ImplementStatus";


import dotenv from 'dotenv';
const API_CORS = process.env.API_CORS;

interface ClientData {
  implement_id: number;
  user_id: number;
}

interface ClientDataFinish {
  implement_id: number;
  user_id: number;
  request_id: number;
  status: string;
}

interface ResponseData {
  request_id: number;
  status: RequestStatus;
  limited_at: string;
  user_id: number; // ¡Ahora se usa el user_id para obtener el socket actual!
  implement_id: number;
  // implement_status: ImplementStatus;
}

/**
 * Adaptador de comunicación para Socket.io con salas admin/cliente
 * + Mapa persistente user_id → socket.id
 */
export class SocketAdapter {
  private static io: Server | null = null;

  private jwtService: JwtService;
  private getUserByIdUseCase: GetUserByIdUseCase;
  private registerRequestUseCase: RegisterRequestUseCase;
  private updateRequestUseCase: UpdateRequestUseCase;


  private admins: Set<string>;
  private students: Set<string>;

  // NUEVO: relación persistente entre user_id y su socket.id actual
  private userSockets: Map<number, string>;

  constructor() {
    this.jwtService = resolveJwtTokenService();
    this.getUserByIdUseCase = resolveGetUserByIdUseCase();
    this.registerRequestUseCase = resolveRegisterRequestUseCase();
    this.updateRequestUseCase = resolveUpdateRequestUseCase();


    this.admins = new Set();
    this.students = new Set();
    this.userSockets = new Map();
  }

  public config(server: any): Server {
    SocketAdapter.io = new Server(server, {
      cors: { 
        origin: API_CORS, 
        methods: ["GET", "POST"],
        credentials: true
      },
    });

    this.applyMiddleware(SocketAdapter.io);

    SocketAdapter.io.on("connection", (socket) =>
      this.handleConnection(socket)
    );

    return SocketAdapter.io;
  }

  private applyMiddleware(ioInstance: Server): void {
    ioInstance.use(async(socket, next) => {
      // const rawCookies = socket.handshake.headers.cookie;
      // if (!rawCookies) return next(new Error('No autenticado'));

      // const cookies = cookie.parse(rawCookies);
      // const token = cookies.access_token;
      const token = socket.handshake.auth.token;

      if (!token) return next(new Error('Token no encontrado'));

      try {
        const payload = await this.jwtService.verify(token);
        socket.data.user = payload;
        next();
      } catch {
        next(new Error('Token inválido'));
      }
    });
  }

  private handleConnection(socket: Socket): void {
    const ADMIN = 1;
    const STUDENT = 2;
    const ioInstance = SocketAdapter.io!;

    socket.on("joinAsAdmin", async ({ id }) => {
      const user = await this.getUserByIdUseCase.execute(id);

      if (user.rol_id === ADMIN) {
        this.admins.add(socket.id);
        this.userSockets.set(id, socket.id); // persistir socket actual
        socket.join("adminRoom");
      }
    });

    socket.on("joinAsClient", async ({ id }) => {
      const user = await this.getUserByIdUseCase.execute(id);

      if (user.rol_id === STUDENT) {
        this.students.add(socket.id);
        this.userSockets.set(id, socket.id); // persistir socket actual
        socket.join("clientRoom");
      }
    });

    socket.on("requestInstrumentToAdmin", (data) =>
      this.handleInstrumentRequest(socket, data, ioInstance)
    );

    socket.on("finishRequestInstrumentToAdmin", (data) =>
      this.handleInstrumentFinishRequest(socket, data, ioInstance)
    );

    socket.on("responseToClient", (data) =>
      this.handleAdminResponse(data, ioInstance)
    );

    socket.on("deleteInstrumentInUse", (data) =>
      this.handleDeleteInstrumentInUseRequest(socket, data, ioInstance)
    );

    socket.on("disconnect", () => {
      [...this.userSockets.entries()].forEach(([uid, sid]) => {
        if (sid === socket.id) this.userSockets.delete(uid);
      });
    });
  }

  private async handleInstrumentRequest(
    socket: Socket,
    data: ClientData,
    ioInstance: Server
  ): Promise<void> {

    ioInstance.to(socket.id).emit("adminResponseToClient", {
      message: "Solicitud recibida, espere aprobación",
    });

    try {
      const newRequest = await this.registerRequestUseCase.execute({
        implement_id: data.implement_id,
        user_id: data.user_id,
      });

      const requestDataToAdmin = {
        ...data,
        request_id: newRequest.request_id,
        user_id: data.user_id,
      };

      ioInstance.to("adminRoom").emit("adminRequestFromClient", requestDataToAdmin);
      ioInstance.to("adminRoom").emit("refreshAdminRoom", { success: true });

    } catch (e) {
      console.log(e);
      let message = "Error desconocido.";
      if (e instanceof ConflictError) message = e.message;
      if (e instanceof ValidationError) message = e.message;
      if(e instanceof NotFoundError) message = e.message

      ioInstance.to(socket.id).emit("requestFailed", {
        success: false,
        message,
      });
    }
  }

  private async handleInstrumentFinishRequest(
    socket: Socket,
    data: ClientDataFinish,
    ioInstance: Server
  ): Promise<void> {

    ioInstance.to(socket.id).emit("adminResponseToClient", {
      message: "Solicitud recibida, espere aprobación",
    });

    try {

      ioInstance.to("adminRoom").emit("adminRequestFromClient", data);

    } catch (e) {
      console.log(e);
      let message = "Error desconocido.";
      if (e instanceof ConflictError) message = e.message;
      if (e instanceof ValidationError) message = e.message;
      if(e instanceof NotFoundError) message = e.message

      ioInstance.to(socket.id).emit("requestFailed", {
        success: false,
        message,
      });
    }
  }

  private async handleAdminResponse(
    data: ResponseData,
    ioInstance: Server
  ): Promise<void> {
    const socketId = this.userSockets.get(data.user_id);


    console.log(`Datos backend ${data}`);

    try {

      const implement_status =
        data.status === "accepted"
          ? ImplementStatus.BORROWED
          : ImplementStatus.AVAILABLE;

      const request = await this.updateRequestUseCase.execute({
        request_id: data.request_id,
        status: data.status,
        limited_at: data.limited_at,
        implement_id: data.implement_id,
        implement_status: implement_status
      });

      // console.log(request.request_id)
      if (request) {
        if (data.status === "refused") {
          ioInstance.to("adminRoom").emit("refreshAdminRoom", { success: true });
        }

        if (["accepted", "finished"].includes(data.status)) {
          ioInstance.to("clientRoom").emit("refreshClientRoom", { success: true });
          ioInstance.to("adminRoom").emit("refreshAdminRoom", { success: true });
        }
      }

      if (socketId) {
        ioInstance.to(socketId).emit("adminResponseToClient", {
          status: data.status
        });
      }
    } catch (e) {
      
      let message = "Error desconocido.";
      if (e instanceof ConflictError) message = e.message;
      if (e instanceof ValidationError) message = e.message;
      if(e instanceof NotFoundError) message = e.message

      // ioInstance.to(socketId).emit("requestFailed", {
      //   success: false,
      //   message,
      // });
    }
  }

  private async handleDeleteInstrumentInUseRequest(
    socket: Socket,
    data: ClientData,
    ioInstance: Server
  ): Promise<void> {
    ioInstance.to("clientRoom").emit("refreshClientRoom", { success: true });
    ioInstance.to(socket.id).emit("adminResponseToClient", { success: true });
  }

  public static getSocket(): Server {
    if (!SocketAdapter.io) {
      throw new Error("Socket.io not configured.");
    }
    return SocketAdapter.io;
  }
}
