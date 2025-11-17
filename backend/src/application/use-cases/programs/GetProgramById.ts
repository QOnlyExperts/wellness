import { IProgramRepository } from "../../../domain/interfaces/IProgramRepository";
import { ProgramOutputDto } from "../../dtos/programs/ProgramOutputDto";
import { ProgramMapper } from "../../mappers/ProgramMapper";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";

export class GetProgramById {
  constructor(private readonly programRepository: IProgramRepository) {}

  public async execute(id: number): Promise<ProgramOutputDto> {
    if (isNaN(id) || id <= 0) {
      throw new ValidationError("El ID del programa no es válido.");
    }

    const program = await this.programRepository.findById(id);

    if (!program) {
      // CORRECCIÓN: Solo pasamos el nombre de la entidad
      throw new NotFoundError("Programa");
    }

    return ProgramMapper.toOutputDto(program);
  }
}