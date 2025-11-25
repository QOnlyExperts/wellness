import { IRequestRepository } from "../../../domain/interfaces/IRequestRepository";
import { RequestEntity } from "../../../domain/entities/RequestEntity";
import { RequestMapper } from "../../mappers/RequestMapper";
import { RequestOutputDto } from "../../dtos/requests/RequestOutputDto";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";
import { Transaction } from "sequelize";

export class UpdateRequestUseCase {
  constructor(private requestRepository: IRequestRepository) {}

  public async execute(
    id: number,
    input: Partial<RequestEntity>,
    t: Transaction
  ): Promise<RequestOutputDto> {

    if (!input || !id) {
      throw new ValidationError("Los campos obligatorios están incompletos.");
    }
    
    const existing = await this.requestRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`La solicitud no fue encontrada`);
    }

    // Aplicar actualización parcial en BD
    const partialData: Partial<RequestEntity> = {
      status: input.status,
      limited_at: input.limited_at,
      implement_id: input.implement_id
    };

    const updated = await this.requestRepository.updateStatus(id, partialData, t);
    return RequestMapper.toOutputDto(updated);
  }
}
  