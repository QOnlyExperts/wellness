import { IProgramRepository } from "../../../domain/interfaces/IProgramRepository";
import { ProgramEntity } from "../../../domain/entities/ProgramEntity";
import { CreateProgramInputDto } from "../../dtos/programs/CreateProgramInputDto";
import { ProgramOutputDto } from "../../dtos/programs/ProgramOutputDto";
import { ProgramMapper } from "../../mappers/ProgramMapper";
import { DuplicateNameError, ValidationError } from "../../../shared/errors/DomainErrors";

export class CreateProgram {
  constructor(private readonly programRepository: IProgramRepository) {}

  public async execute(input: CreateProgramInputDto): Promise<ProgramOutputDto> {
    // Validar si el nombre ya existe
    const existingName = await this.programRepository.findByName(input.name);
    if (existingName) {
      throw new DuplicateNameError(`Un programa con el nombre "${input.name}" ya existe.`);
    }

    // Validar si el código (cod) ya existe
    const existingCod = await this.programRepository.findByCod(input.cod);
    if (existingCod) {
      throw new ValidationError(`Un programa con el código "${input.cod}" ya existe.`);
    }

    // Crear Entidad Pura sin ID
    const newProgram = ProgramEntity.create({
      id: null, // ID es null porque aún no existe en BD
      name: input.name,
      cod: input.cod,
      facult: input.facult,
      status: input.status,
      date: input.date,
    });

    const createdProgram = await this.programRepository.save(newProgram);

    // Mapear a DTO de salida
    return ProgramMapper.toOutputDto(createdProgram);
  }
}