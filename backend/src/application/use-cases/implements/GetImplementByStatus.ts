import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { IGroupImplementRepository} from "../../../domain/interfaces/IGroupImplementRepository";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";


/**
 * Caso de Uso para obtener los implementos por id de grupo.
 * Requiere un DTO de entrada con el id del grupo.
 */
export class GetImplementByStatus {

  constructor(
    private implementRepository: IImplementRepository
  ) {}

  // El DTO de salida es un array de ImplementOutputDto
  public async execute(status: string): Promise<ImplementOutputDto[]> {

    // Obtenemos los valores del enum
    const allowedStatuses = Object.values(ImplementStatus);

    // Verificamos que el estado de entrada este incluido en el enum
    if (!allowedStatuses.includes(status as ImplementStatus)) {
      throw new ValidationError(
        `Estado inválido: '${status}'. Debe ser uno de: ${allowedStatuses.join(", ")}`
      );
    }
    // Obtener los implementos asociados al grupo
    const implementsList: ImplementEntity[] =
      await this.implementRepository.findByStatus(status);

    // Mapear cada entidad a su DTO correspondiente
    return implementsList.map((entity) => ImplementMapper.toOutputDto(entity));
  }
}