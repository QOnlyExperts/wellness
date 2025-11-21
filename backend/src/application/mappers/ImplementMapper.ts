import { GroupImplementEntity } from '../../domain/entities/GroupImplementEntity';
import { ImgEntity } from '../../domain/entities/ImgEntity';
import { ImplementEntity } from '../../domain/entities/ImplementEntity';
import { ImplementOutputDto } from '../dtos/implements/ImplementOutputDto';
import { GroupImplementMapper } from './GroupImplementMapper';

export class ImplementMapper {
  // Mapea la Entidad (objeto rico en lógica) a un DTO (objeto plano para transporte)
  public static toOutputDto(implement: ImplementEntity): any {
    return {
      id: implement.id,
      cod: implement.cod, // Mantener el nombre si es necesario o cambiarlo
      status: implement.status,
      condition: implement.condition,
      imgs: implement.imgs?.map(img => ({
        id: img.id,
        file_name: img.file_name,
        file_path: img.file_path,
        mime_type: img.mime_type,
        description: img.description
      })),
      groupImplement: implement.groupImplement
        ? GroupImplementMapper.toOutputDto(implement.groupImplement)
        : null,
    };
  }

  // DTO o request → Entidad (para casos de uso)
  public static toDomain(data: any): ImplementEntity {
    const imgs = data.Imgs
      ? data.Imgs.map((img: any) => new ImgEntity({
          id: img.id,
          file_name: img.file_name,
          file_path: img.file_path,
          mime_type: img.mime_type,
          description: img.description,
          implement_id: img.implement_id ?? null,
          uploaded_by: img.uploaded_by ?? null,
          created_at: img.created_at,
          updated_at: img.updated_at
        }))
      : [];

    const groupImplement = data.GroupImplement ? GroupImplementEntity.create({
        id: data.GroupImplement.id ?? null,
        prefix: data.GroupImplement.prefix ?? "",
        name: data.GroupImplement.name ?? "",
        max_hours: data.GroupImplement.max_hours ?? 0,
        time_limit: data.GroupImplement.time_limit ?? 0
      })
      : undefined;
      
    return ImplementEntity.create({
      id: data.id,
      cod: data.cod,
      status: data.status,
      condition: data.condition,
      group_implement_id: data.group_implement_id,
      categories_id: data.categories_id,
      imgs,
      groupImplement: groupImplement
    });
  }

  // Extra — soporte para actualizaciones parciales
  // Entidad → objeto para la base de datos (repositorio)
  public static toPersistence(entity: Partial<ImplementEntity>): any {
    const data: any = {};
    
    if (entity.id !== undefined) data.id = entity.id;
    if (entity.cod !== undefined) data.cod = entity.cod;
    if (entity.status !== undefined) data.status = entity.status;
    if (entity.condition !== undefined) data.condition = entity.condition;
    if (entity.group_implement_id !== undefined) data.group_implement_id = entity.group_implement_id;
    if (entity.categories_id !== undefined) data.categories_id = entity.categories_id;

    return data;
  }
}