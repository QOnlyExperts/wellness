import { ImplementEntity } from '../../domain/entities/ImplementEntity';
import { ImplementOutputDto } from '../dtos/implements/ImplementOutputDto';

export class ImplementMapper {
  // Mapea la Entidad (objeto rico en lógica) a un DTO (objeto plano para transporte)
  public static toOutputDto(implement: ImplementEntity): ImplementOutputDto {
    return {
      id: implement.id,
      cod: implement.cod, // Mantener el nombre si es necesario o cambiarlo
      status: implement.status,
      condition: implement.condition,
    };
  }

  // DTO o request → Entidad (para casos de uso)
  public static toDomain(data: any): ImplementEntity {
    return ImplementEntity.create({
      id: data.id,
      cod: data.cod,
      status: data.status,
      condition: data.condition,
      group_implement_id: data.group_implement_id,
      categories_id: data.categories_id
    });
  }

  // Entidad → objeto para la base de datos (repositorio)
  public static toPersistence(entity: ImplementEntity): any {
    return {
      id: entity.id,
      cod: entity.cod,
      status: entity.status,
      group_implement_id: entity.group_implement_id,
      categories_id: entity.categories_id
    };
  }
}