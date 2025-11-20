// application/mappers/InfoPersonMapper.ts
import { InfoPersonEntity } from "../../domain/entities/InfoPersonEntity";
import { ProgramEntity } from "../../domain/entities/ProgramEntity";
import { ProgramMapper } from "./ProgramMapper";

export class InfoPersonMapper {
  // Entidad → DTO plano
  public static toOutputDto(infoPerson: InfoPersonEntity): any {
    return {
      id: infoPerson.id,
      name1: infoPerson.name1,
      name2: infoPerson.name2,
      last_name1: infoPerson.last_name1,
      last_name2: infoPerson.last_name2,
      identification: infoPerson.identification,
      program_id: infoPerson.program_id,
      program: infoPerson.program ? ProgramMapper.toOutputDto(infoPerson.program) : null

    };
  }

  // Objeto (de BD o request) → Entidad de dominio
  public static toDomain(data: any): InfoPersonEntity {

    const program: ProgramEntity | undefined = data.Program
      ? ProgramMapper.toDomain(data.Program)
      : undefined;

    return InfoPersonEntity.create({
      id: data.id ?? null,
      name1: data.name1,
      name2: data.name2 ?? "",
      last_name1: data.last_name1,
      last_name2: data.last_name2 ?? "",
      identification: data.identification ?? '',
      program_id: data.program_id,
      program: program
    });
  }

  // Entidad parcial → Objeto para persistencia (UPDATE parcial)
  public static toPersistence(entity: Partial<InfoPersonEntity>): any {
    const data: any = {};

    if (entity.id !== undefined) data.id = entity.id;
    if (entity.name1 !== undefined) data.name1 = entity.name1;
    if (entity.name2 !== undefined) data.name2 = entity.name2;
    if (entity.last_name1 !== undefined) data.last_name1 = entity.last_name1;
    if (entity.last_name2 !== undefined) data.last_name2 = entity.last_name2;
    if (entity.identification !== undefined)
      data.identification = entity.identification;
    if (entity.program_id !== undefined) data.program_id = entity.program_id;

    return data;
  }
}
