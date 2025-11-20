import { IRequestRepository } from "../../../domain/interfaces/IRequestRepository";
import { RequestEntity } from "../../../domain/entities/RequestEntity";
import { RequestInputDto } from "../../dtos/requests/RequestInputDto";
import { DomainError, ValidationError } from "../../../shared/errors/DomainErrors";
import { RequestMapper } from "../../mappers/RequestMapper";
import { RequestStatus } from "../../../domain/enums/RequestStatus";
import { RequestOutputDto } from "../../dtos/requests/RequestOutputDto";

// Busca la solicitud por estado prestado y ID de persona
export class GetRequestUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) {}

  public async execute(): Promise<RequestOutputDto[]> {

    const requestList: RequestEntity[] = await this.requestRepository.findAll();
    if (!requestList) {
      throw new DomainError("Solicitud no encontrada");
    }
    return requestList.map(request => RequestMapper.toOutputDto(request));
  }
}