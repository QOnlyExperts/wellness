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
      // CORRECCIÓN: Solo pasamos el parámetro del nombre
      throw new DuplicateNameError(input.name);
    }

    // Validar si el código (cod) ya existe
    const existingCod = await this.programRepository.findByCod(input.cod);
    if (existingCod) {
      // CORRECCIÓN: Pasamos un mensaje genérico
      throw new ValidationError("El código del programa ya existe.");
    }

    // ... (el resto del método create y save sigue igual)
    const newProgram = ProgramEntity.create({
      id: null,
      name: input.name,
      cod: input.cod,
      facult: input.facult,
      status: input.status,
      date: input.date,
    });

    const createdProgram = await this.programRepository.save(newProgram);
    return ProgramMapper.toOutputDto(createdProgram);
  }
}