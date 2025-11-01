import { IProgramRepository } from "../../../domain/interfaces/IProgramRepository";
import { ProgramEntity } from "../../../domain/entities/ProgramEntity";
import { ProgramFindDto } from "../../dtos/programs/ProgramFindDto";
import { ProgramOutputDto } from "../../dtos/programs/ProgramOutputDto";
import { ProgramMapper } from "../../mappers/ProgramMapper";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";

export class GetProgramBySearch {
  constructor(private readonly programRepository: IProgramRepository) {}

  public async execute(input: ProgramFindDto): Promise<ProgramOutputDto[]> {
    
    // Validar que se haya proporcionado al menos un criterio
    if (!input.name && !input.cod && !input.facult) {
      throw new ValidationError("Se debe proporcionar al menos un criterio de búsqueda (nombre, código o facultad).");
    }

    let programList: ProgramEntity[] = [];

    if (input.name) {
      const program = await this.programRepository.findByName(input.name);
      if (program) programList.push(program);
    }

    if (input.cod) {
      const program = await this.programRepository.findByCod(input.cod);
      if (program && !programList.find(p => p.id === program.id)) {
        programList.push(program);
      }
    }
    
    // (Añadir lógica similar para 'facult' si creas el método 'findByFacult' en el repositorio)

    if (programList.length === 0) {
      throw new NotFoundError(`No se encontraron programas con los criterios proporcionados.`);
    }

    return programList.map((entity) => ProgramMapper.toOutputDto(entity));
  }
}