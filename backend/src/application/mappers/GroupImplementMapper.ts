import e from 'express';
import { GroupImplementEntity } from '../../domain/entities/GroupImplementEntity';
import { GroupImplementOutputDto } from '../dtos/group-implements/GroupImplementOutputDto';

export class GroupImplementMapper {
  // Entidad → DTO (para respuestas)
  public static toOutputDto(entity: GroupImplementEntity): GroupImplementOutputDto {
    return {
      id: entity.id,
      prefix: entity.prefix,
      name: entity.name,
      max_hours: entity.max_hours,
      time_limit: entity.time_limit
    };
  }

  // DTO o request → Entidad (para casos de uso)
  public static toDomain(data: any): GroupImplementEntity {
    return GroupImplementEntity.create({
      id: data.id,
      prefix: data.prefix,
      name: data.name,
      max_hours: data.max_hours,
      time_limit: data.time_limit
    });
  }

  // Entidad → objeto para la base de datos (repositorio)
  public static toPersistence(entity: GroupImplementEntity): any {
    return {
      id: entity.id,
      prefix: entity.prefix,
      name: entity.name,
      max_hours: entity.max_hours,
      time_limit: entity.time_limit
    };
  }
}
