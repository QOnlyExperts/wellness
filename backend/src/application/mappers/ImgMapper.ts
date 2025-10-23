
import { ImgEntity } from "../../domain/entities/ImgEntity";
import { ImgOutputDto } from "../dtos/img-file/ImgOutputDto";

export class ImgMapper {
  public static toOutputDto(entity: ImgEntity): ImgOutputDto {
    return{
      id: entity.id,
      file_name: entity.file_name,
      file_path: entity.file_path,
      mime_type: entity.mime_type,
      size_bytes: entity.size_bytes,
      description: entity.description,
      instrument_id: entity.instrument_id,
      uploaded_by: entity.uploaded_by,
      created_at: entity.created_at,
      updated_at: entity.updated_at
    }
  }

  public static toDomain(data: any): ImgEntity {
    return ImgEntity.create({
      id: data.id,
      file_name: data.file_name,
      file_path: data.file_path,
      mime_type: data.mime_type,
      size_bytes: data.size_bytes,
      description: data.description,
      instrument_id: data.instrument_id,
      uploaded_by: data.uploaded_by,
      created_at: data.created_at,
      updated_at: data.updated_at
    })
  }

  public static toPersistence(entity: ImgEntity): any {
    return{
      id: entity.id,
      file_name: entity.file_name,
      file_path: entity.file_path,
      mime_type: entity.mime_type,
      size_bytes: entity.size_bytes,
      description: entity.description,
      instrument_id: entity.instrument_id,
      uploaded_by: entity.uploaded_by,
      created_at: entity.created_at,
      updated_at: entity.updated_at
    }
  }
}