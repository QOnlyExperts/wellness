import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { NotFoundError } from "../../../shared/errors/DomainErrors";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";


/**
 * Caso de Uso para obtener los implementos por id de grupo.
 * Requiere un DTO de entrada con el id del grupo.
 */
export class GetImplementByIdGroup {

  constructor(
    private groupImplementRepository: IImplementRepository,
    private implementRepository: IImplementRepository
  ) {}

  // El DTO de salida es un array de ImplementOutputDto
  public async execute(idGroup: number): Promise<ImplementOutputDto[]> {

    // Verificar que el grupo de implementos existe
    const groupId = await this.groupImplementRepository.findById(idGroup);
    if (!groupId) {
      throw new NotFoundError(`Grupo de implementos no encontrado.`);
    }

    // Obtener los implementos asociados al grupo
    const implementsList: ImplementEntity[] =
      await this.implementRepository.findByIdGroup(idGroup);
      
    // Mapear cada entidad a su DTO correspondiente
    return implementsList.map((entity) => ImplementMapper.toOutputDto(entity));
  }
}