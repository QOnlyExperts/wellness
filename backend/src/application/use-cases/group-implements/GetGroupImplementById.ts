import { IGroupImplementRepository } from "../../../domain/interfaces/IGroupImplementRepository";
import { GroupImplementMapper } from "../../mappers/GroupImplementMapper";
import { GroupImplementOutputDto } from "../../dtos/group-implements/GroupImplementOutputDto";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";

export class GetGroupImplementById {
  constructor(
    private readonly groupImplementRepository: IGroupImplementRepository
  ) {}

  public async execute(id: number): Promise<GroupImplementOutputDto> {
    // Validación minima para verificar que el ID es un numero positivo
    if (isNaN(id) || id <= 0) {
      throw new ValidationError("ID inválido.");
    }

    // Buscar el GroupImplement por ID
    const groupImplement = await this.groupImplementRepository.findById(id);

    // Si no se encuentra, lanzar un error
    if (!groupImplement) {
      throw new NotFoundError(`Grupo de Implementos no encontrado.`);
    }

    // Mapear el resultado a un DTO de salida
    return GroupImplementMapper.toOutputDto(groupImplement);
  }
}
