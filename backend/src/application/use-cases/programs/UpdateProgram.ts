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
    
    const existingProgram = await this.programRepository.findById(id);
    if (!existingProgram) {
      // CORRECCIÓN: Solo pasamos el nombre de la entidad
      throw new NotFoundError("Programa");
    }

    if (input.name) {
      const existingName = await this.programRepository.findByName(input.name);
      if (existingName && existingName.id !== id) {
        // CORRECCIÓN: Solo pasamos el parámetro del nombre
        throw new DuplicateNameError(input.name);
      }
    }

    if (input.cod) {
      const existingCod = await this.programRepository.findByCod(input.cod);
      if (existingCod && existingCod.id !== id) {
        throw new ValidationError("El código del programa ya existe.");
      }
    }

    //Actualizar campos opcionales uno por uno
    if (input.name !== undefined) {
      existingProgram.name = input.name;
    }
    if (input.cod !== undefined) {
      existingProgram.cod = input.cod;
    }
    if (input.facult !== undefined) {
      existingProgram.facult = input.facult;
    }
    if (input.status !== undefined) {
      existingProgram.status = input.status;
    }
    if (input.date !== undefined) {
      existingProgram.date = input.date;
    }

   //Guardar la entidad actualizada
    const updatedProgram = await this.programRepository.save(existingProgram);

    //Mapear a DTO de salida
    return ProgramMapper.toOutputDto(updatedProgram);
  }
}