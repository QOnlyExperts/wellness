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
      amount: entity.amount ? entity.amount : 0,
      max_hours: entity.max_hours,
      time_limit: entity.time_limit,
      images_preview: entity.images_preview ?? []
    };
  }

  // DTO o request → Entidad (para casos de uso)
  public static toDomain(data: any): GroupImplementEntity {
    return GroupImplementEntity.create({
      id: data.id,
      prefix: data.prefix,
      name: data.name,
      amount: data.amount,
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
      amount: entity.amount,
      max_hours: entity.max_hours,
      time_limit: entity.time_limit
    };
  }
}
