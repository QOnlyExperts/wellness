import { RequestEntity } from "../entities/RequestEntity";


export interface IRequestRepository {
  // Define los métodos que el repositorio debe implementar
  findAll(): Promise<RequestEntity[]>; // Carga todas las solicitudes para admin
  findById(id: number): Promise<RequestEntity | null>; // Busca una solicitud por ID
  findByInfoPersonId(infoPersonId: number): Promise<RequestEntity[]>; // Busca solicitudes por ID de persona
  findByStatusByInfoPersonId(infoPersonId: number): Promise<RequestEntity | null>; // Busca la solicitud por estado prestado y ID de persona
  save(request: RequestEntity): Promise<RequestEntity>;  // Crea una nueva solicitud
  updateStatus(id: number, update: Partial<RequestEntity>): Promise<RequestEntity>; // Actualiza el estado de una solicitud
  delete(id: number): Promise<void>; // Elimina una solicitud
}