// src/application/mappers/ProgramMapper.ts

import { ProgramEntity } from '../../domain/entities/ProgramEntity';
import { ProgramOutputDto } from '../dtos/programs/ProgramOutputDto';

/**
 * Clase traductora para 'Programs'.
 * Sigue el patrón de GroupImplementMapper.ts.
 */
export class ProgramMapper {
  /**
   * Mapea una entidad de dominio a un DTO de salida (para la API).
   */
  public static toOutputDto(entity: ProgramEntity): ProgramOutputDto {
    return {
      id: entity.id,
      name: entity.name,
      cod: entity.cod,
      facult: entity.facult,
      status: entity.status,
      date: entity.date,
    };
  }

  /**
   * Mapea datos crudos (ej: de la DB) a una entidad de dominio.
   */
  public static toDomain(data: any): ProgramEntity {
    return ProgramEntity.create({
      id: data.id,
      name: data.name,
      cod: data.cod,
      facult: data.facult,
      status: data.status,
      date: data.date,
    });
  }

  /**
   * Mapea una entidad de dominio a un objeto plano para la base de datos.
   */
  public static toPersistence(entity: ProgramEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      cod: entity.cod,
      facult: entity.facult,
      status: entity.status,
      date: entity.date,
    };
  }
}