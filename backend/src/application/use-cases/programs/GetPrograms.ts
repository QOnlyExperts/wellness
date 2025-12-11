import { IProgramRepository } from "../../../domain/interfaces/IProgramRepository";
import { ProgramOutputDto } from "../../dtos/programs/ProgramOutputDto";
import { ProgramMapper } from "../../mappers/ProgramMapper";
import { ProgramEntity } from "../../../domain/entities/ProgramEntity";

export class GetPrograms {
  constructor(private readonly programRepository: IProgramRepository) {}

  public async execute(): Promise<ProgramOutputDto[]> {
    const programList: ProgramEntity[] = await this.programRepository.findAll();

    // Mapear cada entidad al DTO de salida
    return programList.map((entity) => ProgramMapper.toOutputDto(entity));
  }
}