// application/mappers/RequestMapper.ts

import { RequestEntity } from "../../domain/entities/RequestEntity";
import { ImplementEntity } from "../../domain/entities/ImplementEntity";
import { InfoPersonEntity } from "../../domain/entities/InfoPersonEntity";
import { InfoPersonMapper } from "./InfoPersonMapper";
import { ImplementMapper } from "./ImplementMapper"; // <--- ASUMIDO
import { RequestStatus } from "../../domain/enums/RequestStatus";


export class RequestMapper {
  /**
   * Entidad -> DTO plano para salida (API Response)
   * Incluye la información expandida de InfoPerson e Implement.
   */
  public static toOutputDto(request: RequestEntity): any {
    return {
      id: request.id,
      status: request.status,
      created_at: request.created_at,
      finished_at: request.finished_at,
      limited_at: request.limited_at,
      info_person_id: request.info_person_id,
      implement_id: request.implement_id,
      
      // Relaciones: se mapean si existen
      info_person: request.info_person 
        ? InfoPersonMapper.toOutputDto(request.info_person) 
        : null,
      
      implement: request.implement 
        ? ImplementMapper.toOutputDto(request.implement) 
        : null,
    };
  }

  /**
   * Objeto plano (Modelo DB con relaciones) -> Entidad de dominio RequestEntity.
   *
   * Se espera que las relaciones vengan en `data.info_person` y `data.implement`.
   */
  public static toDomain(data: any): RequestEntity {
    
    // Implement (si viene cargada)
    const implement: ImplementEntity | undefined = data.Implement
      ? ImplementMapper.toDomain(data.Implement)
      : undefined;

    // InfoPerson (si viene cargada)
    const infoPerson: InfoPersonEntity | undefined = data.Info_person
      ? InfoPersonMapper.toDomain(data.Info_person)
      : undefined;

    return new RequestEntity({
      id: data.id ?? null,
      
      // Asegura que el estado sea un valor válido del enum (si es necesario)
      status: data.status as RequestStatus, 
      
      created_at: data.created_at ? new Date(data.created_at) : new Date(),
      finished_at: data.finished_at ? new Date(data.finished_at) : null,
      limited_at: data.limited_at ? new Date(data.limited_at) : new Date(), // Usar new Date() como valor por defecto es poco seguro, considera null o requerir el campo.
      
      info_person_id: data.info_person_id,
      implement_id: data.implement_id,
      
      info_person: infoPerson,
      implement: implement,
    });
  }

  /**
   * Entidad -> Objeto plano para persistencia (base de datos).
   * Solo incluye los campos que se guardan en la tabla Request.
   */
  public static toPersistence(request: Partial<RequestEntity>): any {
    const data: any = {};

    if(request.id !== undefined) data.id = request.id;
    if(request.status !== undefined) data.status = request.status;
    if(request.created_at !== undefined) data.created_at = request.created_at;
    if(request.finished_at !== undefined) data.finished_at = request.finished_at;
    if(request.limited_at !== undefined) data.limited_at = request.limited_at;
    if(request.info_person_id !== undefined) data.info_person_id = request.info_person_id;
    if(request.implement_id !== undefined) data.implement_id = request.implement_id;

    // const data: any = {
    //   id: request.id ?? undefined, // Usamos undefined para que el ORM lo ignore si es un "create"
    //   status: request.status,
    //   created_at: request.created_at,
    //   finished_at: request.finished_at,
    //   limited_at: request.limited_at,
    //   info_person_id: request.info_person_id,
    //   implement_id: request.implement_id,
    // };

    // Elimina campos undefined para que el repositorio los ignore
    // Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    return data;
  }
}