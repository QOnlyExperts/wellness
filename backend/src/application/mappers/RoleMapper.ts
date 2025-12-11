// src/application/mappers/RoleMapper.ts

import { RoleEntity } from '../../domain/entities/RoleEntity';
import { RoleOutputDto } from '../dtos/roles/RoleOutputDto';

/**
 * Clase traductora para convertir entre RoleEntity, DTOs y objetos de persistencia.
 */
export class RoleMapper {
  /**
   * Mapea una entidad de dominio a un DTO de salida (para la API).
   */
  public static toOutputDto(role: RoleEntity): RoleOutputDto {
    return {
      id: role.id,
      name: role.name,
      status: role.status,
    };
  }

  /**
   * Mapea datos crudos (ej: de la DB) a una entidad de dominio.
   */
  public static toDomain(data: any): RoleEntity {
    return RoleEntity.create({
      id: data.id,
      name: data.name,
      status: data.status,
    });
  }

  /**
   * Mapea una entidad de dominio a un objeto plano para la base de datos.
   */
  public static toPersistence(entity: RoleEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      status: entity.status,
    };
  }
}