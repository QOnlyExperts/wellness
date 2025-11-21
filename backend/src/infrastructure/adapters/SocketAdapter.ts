// src/infrastructure/adapters/SocketAdapter.ts

import { Server, Socket } from "socket.io";

import { 
  resolveJwtTokenService,
  resolveGetUserByIdUseCase,
  resolveCreateRequestUseCase, 
  resolveGetRequestUseCase 
} from "../../composition/compositionRoot";

import { JwtService } from "../../application/services/JwtService";
import { CreateRequestUseCase } from "../../application/use-cases/request/CreateRequestUseCase";
import { GetRequestUseCase } from "../../application/use-cases/request/GetRequestUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/users/GetUserByIdUseCase";

// Definición de tipos para la estructura de datos que esperamos
interface ClientData {
  implement_id: number;
  user_id: number;
}

interface ResponseData {
  request_id: number;
  status: string; // REQUESTED, ACCEPTED, REFUSED, FINISHED
  clientId: string; // Id que se encuentra en el socket al hacer la solicitud
}

/**
 * Clase adaptadora (Controlador de Transporte) para Socket.io.
 * Es un Adaptador de Infraestructura que gestiona la comunicación bidireccional,
 * delegando la lógica de negocio al IRequestManagementPort (DIP).
 */
export class SocketAdapter {
  // 💡 Singleton Pattern: Almacena la única instancia del servidor IO
  private static io: Server | null = null;

  private jwtService: JwtService;
  private getUserByIdUseCase: GetUserByIdUseCase;
  private createRequestUseCase: CreateRequestUseCase;

  // Almacena los ID de sockets de administradores para fines de limpieza/manejo de estado
  private admins: Set<string>;
  private students: Set<string>;

  // Constructor que inyecta la dependencia (DIP)
  constructor() {
    this.jwtService = resolveJwtTokenService();
    this.getUserByIdUseCase = resolveGetUserByIdUseCase();
    this.createRequestUseCase = resolveCreateRequestUseCase();

    // Inicializa el conjunto de administradores
    this.admins = new Set<string>();
    this.students = new Set<string>();
  }

  /**
   * 💡 SRP: Configura e inicializa el servidor Socket.io.
   */
  public config(server: any): Server {
    SocketAdapter.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // 1. Aplicar Middlewares de autenticación
    this.applyMiddleware(SocketAdapter.io);

    // 2. Configurar el Manejo de Conexiones
    SocketAdapter.io.on("connection", (socket: Socket) =>
      this.handleConnection(socket)
    );

    return SocketAdapter.io;
  }


  /**
   * 💡 Método para aplicar middlewares de conexión (ej. Autenticación)
   */
  private applyMiddleware(ioInstance: Server): void {
    
    ioInstance.use(async (socket, next) => {
      try{
        const token = socket.handshake.query.token as string;
        await this.jwtService.verify(token);

        return next();
      }catch(e){
        return next(new Error("Authentication error"));
      }
    });
  }

  /**
   * 💡 SRP: Maneja el ciclo de vida de una conexión individual y sus suscripciones a eventos.
   */
  private handleConnection(socket: Socket): void {
    
    const ADMIN = 1;
    const STUDENT = 2;
    // const user = socket.data.user;
    const ioInstance = SocketAdapter.io!; // Aseguramos que la instancia existe

    // --- Suscripciones a Eventos de Entrada (Input Events) ---

    // 1. Unirse a la Sala de Administradores
    socket.on("joinAsAdmin", async (data: { id: number }) => {
      // Consultamos el id
      console.log(data.id);
      const result = await this.getUserByIdUseCase.execute(data.id);
      console.log(result);

      // Validamos el rol
      if (result.rol_id && result.rol_id === ADMIN) {
        // Guardamos en la sala establecida
        this.admins.add(socket.id);

        socket.join("adminRoom");
        // console.log(`Admin ${user._id} joined adminRoom`);
      }
    });

    // 2. Unirse a la Sala de Clientes
    socket.on("joinAsClient", async (data: { id: number }) => {
      const result = await this.getUserByIdUseCase.execute(data.id);
      if (result.rol_id && result.rol_id === STUDENT) {
        this.students.add(socket.id);

        socket.join("clientRoom");
        // console.log(`Client ${user._id} joined clientRoom`);
      }
    });

    // 3. Solicitar Instrumento (Petición del Cliente)
    socket.on("requestInstrumentToAdmin", (data: ClientData) =>
      this.handleInstrumentRequest(socket, data, ioInstance)
    );

    // 4. Respuesta del Administrador (Petición del Administrador)
    socket.on("responseToClient", (data: ResponseData) =>
      this.handleAdminResponse(data, ioInstance)
    );

    // 5. Borrar Instrumento en Uso (Petición del Cliente/Admin)
    socket.on("deleteInstrumentInUse", (data: ClientData) =>
      this.handleDeleteInstrumentInUseRequest(socket, data, ioInstance)
    );

    // --- Evento de Limpieza ---
    socket.on("disconnect", () => {
      if (this.admins.has(socket.id)) {
        this.admins.delete(socket.id);
      }
    });
  }

  /**
   * Lógica para manejar la solicitud de instrumento de un cliente a un administrador.
   */
  private async handleInstrumentRequest(
    socket: Socket,
    data: ClientData,
    ioInstance: Server
  ): Promise<void> {

    // Manda mensaje de recibido al cliente en especifico
    // ioInstance
    //   .to(socket.id)
    //   .emit("adminResponseToClient", { 
    //     success: true,
    //     status: "requested",
    //     message: "Solicitud recibida, espere aprobación" 
    //   });

    // Envío a la sala de Administradores (Multicast)
    // La información de data debe ser cargada por endpoints desde el frontend de administrador
    ioInstance.to("adminRoom").emit("adminRequestFromClient", data);
  }

  /**
   * 💡 SRP: Lógica para manejar la respuesta del administrador al estudiante individual.
   */
  private async handleAdminResponse(
    data: ResponseData,
    ioInstance: Server
  ): Promise<void> {

    // Notificación a la Sala de Clientes para refrescar (Broadcast)
    ioInstance.to("clientRoom").emit("refreshClientRoom", { success: true });

    // Notificación individual al cliente original (1:1)
    ioInstance.to(data.clientId).emit("adminResponseToClient", data);
  }

  /**
   * 💡 SRP: Lógica para solicitar la liberación de un instrumento en uso y mostrarlo a todos los estudiantes.
   */

  // Mientras se eliminar desde el usuario sin solicitar al administrador
  private async handleDeleteInstrumentInUseRequest(
    socket: Socket,
    data: ClientData,
    ioInstance: Server
  ): Promise<void> {

    // Notificación a la Sala de Clientes para refrescar (Broadcast)
    ioInstance.to("clientRoom").emit("refreshClientRoom", { success: true });

    // Notificación individual al cliente (1:1)
    ioInstance.to(socket.id).emit("adminResponseToClient", { success: true });
  }

  /**
   * 💡 Función estática para obtener la instancia de IO desde fuera del Adaptador.
   */
  public static getSocket(): Server {
    if (!SocketAdapter.io) {
      throw new Error("Socket.io not configured. Call config() first.");
    }
    return SocketAdapter.io;
  }
}
