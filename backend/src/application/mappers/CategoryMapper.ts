// application/mappers/CategoryMapper.ts

import { CategoryEntity } from '../../domain/entities/CategoryEntity';
import { CategoryOutputDto } from '../dtos/category/CategoryOutputDto';

export class CategoryMapper {
  /**
   * Mapea una entidad de dominio a un DTO de salida (para la API).
   * @param category La entidad de dominio CategoryEntity.
   * @returns Un objeto plano (DTO) con los datos a exponer.
   */
  public static toOutputDto(category: CategoryEntity): CategoryOutputDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }

  /**
   * Mapea datos crudos (ej: de la DB o un request) a una entidad de dominio.
   * @param data Objeto con datos de la categoría.
   * @returns Una instancia de CategoryEntity.
   */
  public static toDomain(data: any): CategoryEntity {
    // Usamos un método estático 'create' en la entidad para mantener la consistencia
    // del código, tal como lo hace ImplementMapper.
    return CategoryEntity.create({
      id: data.id,
      name: data.name,
      description: data.description,
    });
  }

  /**
   * Mapea una entidad de dominio a un objeto plano para la base de datos.
   * @param entity La entidad de dominio CategoryEntity.
   * @returns Un objeto simple para ser guardado por el repositorio.
   */
  public static toPersistence(entity: CategoryEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }
}