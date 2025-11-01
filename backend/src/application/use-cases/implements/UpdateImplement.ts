import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { ImplementInputDto } from "../../dtos/implements/ImplementInputDto";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";
import { ImplementUpdateDto } from "../../dtos/implements/ImplementUpdateDto";
import { NotFoundError } from "../../../shared/errors/DomainErrors";

export class UpdateImplement {
  constructor(
    private implementRepository: IImplementRepository
  ) {}

  public async execute(
    id: number,
    input: ImplementUpdateDto
  ): Promise<ImplementOutputDto> {

    const existing = await this.implementRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Implemento no encontrado');
    }

    // Aplicar los cambios parciales sobre la entidad existente
    if (input.status !== undefined) {
      existing.changeStatus(input.status);
    }

    // Convertimos la entidad a un objeto parcial para persistencia
    const partialData: Partial<ImplementEntity> = {
      status: existing.status,
      imgs: existing.imgs
      // Agrega más campos si los manejas
    };

    const updated = await this.implementRepository.updatePartial(id, partialData);

    return ImplementMapper.toOutputDto(updated);
  }
}
