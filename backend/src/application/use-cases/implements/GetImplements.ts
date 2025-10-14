import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";

/**
 * Caso de Uso para obtener todos los implementos.
 * No requiere un DTO de entrada.
 */
export class GetImplements {
  constructor(private implementRepository: IImplementRepository) {}

  // El DTO de salida es un array de ImplementOutputDto
  public async execute(): Promise<ImplementOutputDto[]> {
    
    const implementsList: ImplementEntity[] =
      await this.implementRepository.findAll();

    // Mapear cada entidad a su DTO correspondiente
    return implementsList.map((entity) => ImplementMapper.toOutputDto(entity));
  }
}

