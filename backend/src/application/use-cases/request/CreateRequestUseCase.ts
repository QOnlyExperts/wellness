import { IRequestRepository } from "../../../domain/interfaces/IRequestRepository";
import { RequestEntity } from "../../../domain/entities/RequestEntity";
import { RequestInputDto } from "../../dtos/requests/RequestInputDto";
import { Transaction } from "sequelize";
import { ConflictError, DomainError, ValidationError } from "../../../shared/errors/DomainErrors";
import { RequestMapper } from "../../mappers/RequestMapper";
import { RequestStatus } from "../../../domain/enums/RequestStatus";
import { RequestOutputDto } from "../../dtos/requests/RequestOutputDto";

export class CreateRequestUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) {}

  public async execute(
    input: RequestInputDto,
  ): Promise<RequestOutputDto> {
    if(!input.info_person_id || !input.implement_id){
      throw new ValidationError("Los campos obligatorios están incompletos.");
    }

    const findRequest = await this.requestRepository.findPendingRequest(input.info_person_id);
    if(findRequest){
      throw new ConflictError("Ya se encuentra una solicitud pendiente.");
    }
    
    const request = RequestEntity.create({
      id: null,
      status: RequestStatus.REQUESTED, // Solicitado
      created_at: new Date(),
      finished_at: null,
      limited_at: new Date(),
      duration_hours: 0,
      info_person_id: input.info_person_id,
      implement_id: input.implement_id,
    });

    const createdRequest = await this.requestRepository.save(request);
    if (!createdRequest || !createdRequest.id) {
      throw new DomainError("No se pudo guardar la solicitud");
    }
    return RequestMapper.toOutputDto(createdRequest);
  }
}