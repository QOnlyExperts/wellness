import { IProgramRepository } from "../../../domain/interfaces/IProgramRepository";
import { ProgramEntity } from "../../../domain/entities/ProgramEntity";
import { UpdateProgramInputDto } from "../../dtos/programs/UpdateProgramInputDto";
import { ProgramOutputDto } from "../../dtos/programs/ProgramOutputDto";
import { ProgramMapper } from "../../mappers/ProgramMapper";
import { DuplicateNameError, ValidationError, NotFoundError } from "../../../shared/errors/DomainErrors";

export class UpdateProgram {
  constructor(private readonly programRepository: IProgramRepository) {}

  public async execute(
    id: number,
    input: UpdateProgramInputDto
  ): Promise<ProgramOutputDto> {
    
    // Validar si el ID existe
    const existingProgram = await this.programRepository.findById(id);
    if (!existingProgram) {
      throw new NotFoundError(`el Programa no fue encontrado.`);
    }

    // Validar si el nuevo nombre ya existe en OTRO programa
    if (input.name) {
      const existingName = await this.programRepository.findByName(input.name);
      if (existingName && existingName.id !== id) {
        throw new DuplicateNameError(`Un programa con el nombre "${input.name}" ya existe.`);
      }
    }

    // Validar si el nuevo código (cod) ya existe en OTRO programa
    if (input.cod) {
      const existingCod = await this.programRepository.findByCod(input.cod);
      if (existingCod && existingCod.id !== id) {
        throw new ValidationError(`Un programa con el código "${input.cod}" ya existe.`);
      }
    }

    // Aplicar los campos del DTO a la entidad existente
    // Usamos 'Object.assign' para actualizar solo los campos que vienen en el input
    Object.assign(existingProgram, input);

    // Guardar los cambios
    const updatedProgram = await this.programRepository.save(existingProgram);

    // Mapear a DTO de salida
    return ProgramMapper.toOutputDto(updatedProgram);
  }
}