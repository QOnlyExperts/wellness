import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { ImplementInputDto } from "../../dtos/implements/ImplementInputDto";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";
import { ImplementUpdateDto } from "../../dtos/implements/ImplementUpdateDto";
import { NotFoundError } from "../../../shared/errors/DomainErrors";


export class UpdateMultipleImplements {
  constructor(private implementRepository: IImplementRepository) {}

  public async execute(
    updates: ImplementUpdateDto[]
  ): Promise<ImplementOutputDto[]> {

    const updatedImplements: ImplementOutputDto[] = [];

    for (const input of updates) {
      if (!input.id) continue; // Seguridad: omitir si no tiene ID

      const existing = await this.implementRepository.findById(input.id);
      if (!existing) {
        throw new NotFoundError(`Uno de los implementos no fue encontrado`);
      }

      // Actualización parcial sobre la entidad
      if (input.status !== undefined){
        existing.changeStatus(input.status);
      }

      // Aplicar actualización parcial en BD
      const partialData: Partial<ImplementEntity> = {
        status: existing.status,
      };

      const updated = await this.implementRepository.updatePartial(input.id, partialData);
      updatedImplements.push(ImplementMapper.toOutputDto(updated));
    }

    return updatedImplements;
  }
}
