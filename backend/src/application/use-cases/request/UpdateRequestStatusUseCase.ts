import { IRequestRepository } from "../../../domain/interfaces/IRequestRepository";
import { RequestEntity } from "../../../domain/entities/RequestEntity";
import { RequestMapper } from "../../mappers/RequestMapper";
import { RequestOutputDto } from "../../dtos/requests/RequestOutputDto";
import {
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/DomainErrors";
import { Transaction } from "sequelize";
import { RequestStatus } from "../../../domain/enums/RequestStatus";

export class UpdateRequestStatusUseCase {
  constructor(private requestRepository: IRequestRepository) {}

  public async execute(
    id: number,
    input: Partial<RequestEntity>,
    t: Transaction
  ): Promise<RequestOutputDto> {
    // ... (Validación de input y existing)
    if (isNaN(id) || id <= 0) {
      throw new ValidationError("ID inválido.");
    }

    if(!input || !id || !input.status){
      throw new ValidationError("Los campos obligatorios están incompletos.");
    }

    const existing = await this.requestRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Solicitud no encontrada");
    }

    // *** CAMBIO CRÍTICO DE LÓGICA AQUÍ ***
    // "¿El usuario está intentando establecer un nuevo estado (input.status) Y ese nuevo estado es diferente al que ya tiene la solicitud (existing.getStatus())?"
    // Si la respuesta es SÍ a ambas partes, procedemos a ejecutar la lógica
    if (input.status && existing.getStatus() !== input.status) {
      // Si el input trae un nuevo estado (ej. ACCEPTED),
      // la lógica de transición debe ocurrir en la entidad.

      if (input.status === RequestStatus.ACCEPTED) {
        // Si el usuario quiere ACEPTAR, llama al método de la entidad.
        // Si ya estaba aceptada o es inválido, existing.accept() lanzará el error.
        existing.accept(id);
      }

      // Puedes añadir lógica para otros estados:
      if (input.status === RequestStatus.REFUSED) {
        existing.refuse();
      }

      if(input.status === RequestStatus.FINISHED){
        existing.finish();
      }
    }
    // Asumiendo que 'input.limited_at_string' viene del frontend con el sufijo '-05:00'
    const limitedAtValue = input.limited_at
      ? new Date(input.limited_at).toISOString()
      : null;
      
    // Aplicar actualización parcial en BD
    const partialData: Partial<RequestEntity> = {
      status: existing.getStatus(), 
      limited_at: limitedAtValue, // Asignará null si input.limited_at era null, undefined, o vacío
      implement_id: input.implement_id,
    };

    const updated = await this.requestRepository.updateStatus(
      id,
      partialData,
      t
    );
    return RequestMapper.toOutputDto(updated);
  }
}
