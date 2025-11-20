import { IRequestRepository } from "../../../domain/interfaces/IRequestRepository";
import { RequestEntity } from "../../../domain/entities/RequestEntity";
import { RequestInputDto } from "../../dtos/requests/RequestInputDto";
import { Transaction } from "sequelize";
import { DomainError, ValidationError } from "../../../shared/errors/DomainErrors";
import { RequestMapper } from "../../mappers/RequestMapper";
import { RequestStatus } from "../../../domain/enums/RequestStatus";

export class CreateRequestUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) {}

  public async execute(
    input: RequestInputDto,
  ): Promise<void> {
    if(!input.info_person_id || !input.implement_id){
      throw new ValidationError("Los campos obligatorios están incompletos.");
    }
    
    const request = RequestEntity.create({
      id: null,
      status: RequestStatus.REQUESTED, // Solicitado
      created_at: new Date(),
      finished_at: new Date(),
      limited_at: input.limited_at,
      info_person_id: input.info_person_id,
      implement_id: input.implement_id,
    });

    const createdRequest = await this.requestRepository.save(request);
    if (!createdRequest) {
      throw new DomainError("No se pudo guardar la solicitud");
    }
    return RequestMapper.toOutputDto(createdRequest);
  }
}