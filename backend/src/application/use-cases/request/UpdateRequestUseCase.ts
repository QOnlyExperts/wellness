import { IRequestRepository } from "../../../domain/interfaces/IRequestRepository";
import { RequestEntity } from "../../../domain/entities/RequestEntity";
import { RequestMapper } from "../../mappers/RequestMapper";
import { RequestOutputDto } from "../../dtos/requests/RequestOutputDto";
import { NotFoundError } from "../../../shared/errors/DomainErrors";

export class UpdateRequestUseCase {
  constructor(private requestRepository: IRequestRepository) {}

  public async execute(
    id: number,
    updates: Partial<RequestEntity>
  ): Promise<RequestOutputDto> {
    const existing = await this.requestRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`La solicitud no fue encontrada`);
    }

    // Aplicar actualización parcial en BD
    const partialData: Partial<RequestEntity> = {
      status: updates.status,
    };

    const updated = await this.requestRepository.updateStatus(id, partialData);
    return RequestMapper.toOutputDto(updated);
  }
}
  