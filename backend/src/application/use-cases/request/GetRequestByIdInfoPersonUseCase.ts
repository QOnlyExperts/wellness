import { IRequestRepository } from "../../../domain/interfaces/IRequestRepository";
import { RequestEntity } from "../../../domain/entities/RequestEntity";
import { RequestInputDto } from "../../dtos/requests/RequestInputDto";
import { DomainError, ValidationError } from "../../../shared/errors/DomainErrors";
import { RequestMapper } from "../../mappers/RequestMapper";
import { RequestStatus } from "../../../domain/enums/RequestStatus";
import { RequestOutputDto } from "../../dtos/requests/RequestOutputDto";

// Busca la solicitud por estado prestado y ID de persona
export class GetRequestByIdInfoPersonUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) {}

  public async execute(
    id: number,
  ): Promise<RequestOutputDto[]> {
    // Validación minima para verificar que el ID es un numero positivo
    if (isNaN(id) || id <= 0) {
      throw new ValidationError("ID inválido.");
    }

    const requestList: RequestEntity[] = await this.requestRepository.findByInfoPersonId(id);
    if (!requestList) {
      throw new DomainError("Solicitud no encontrada");
    }
    return requestList.map(request => RequestMapper.toOutputDto(request));
  }
}