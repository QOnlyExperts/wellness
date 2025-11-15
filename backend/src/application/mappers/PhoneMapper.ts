// src/application/mappers/PhoneMapper.ts

import { PhoneEntity } from '../../domain/entities/PhoneEntity';
import { PhoneOutputDto } from '../dtos/phones/PhoneOutputDto';


export class PhoneMapper {
  
  public static toOutputDto(entity: PhoneEntity): PhoneOutputDto {
    return {
      id: entity.id,
      number: entity.number,
      info_person_id: entity.info_person_id,
    };
  }


  public static toDomain(data: any): PhoneEntity {
    // Convertimos el string de BIGINT a un 'bigint' nativo de JavaScript
    const numberAsBigInt = typeof data.number === 'string' 
      ? BigInt(data.number) 
      : data.number;

    return PhoneEntity.create({
      id: data.id,
      number: numberAsBigInt,
      info_person_id: data.info_person_id,
    });
  }

 
  public static toPersistence(entity: PhoneEntity): any {
    return {
      id: entity.id,
      number: entity.number,
      info_person_id: entity.info_person_id,
    };
  }
}