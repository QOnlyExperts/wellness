import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { ImplementInputDto } from "../../dtos/implements/ImplementInputDto";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";
import { ImplementUpdateDto } from "../../dtos/implements/ImplementUpdateDto";
import { ConflictError, NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";
import { Transaction } from "sequelize";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";


export class UpdateImplementStatus {
  constructor(private implementRepository: IImplementRepository) {}

  public async execute(
    id: number,
    input: ImplementUpdateDto,
    t: Transaction
  ): Promise<ImplementOutputDto> {

    if (!input || !id) {
      throw new ValidationError("Los campos obligatorios están incompletos.");
    }

    const existing = await this.implementRepository.findById(id);
    if (existing?.status === ImplementStatus.BORROWED) {
      throw new ConflictError(`Implemento se encuentra en uso`);
    }

    // Aplicar actualización parcial en BD
    const partialData: Partial<ImplementEntity> = {
      status: input.status,
    };
    const updated = await this.implementRepository.updatePartialData(id, partialData, t);

    return ImplementMapper.toOutputDto(updated);
  }
}
