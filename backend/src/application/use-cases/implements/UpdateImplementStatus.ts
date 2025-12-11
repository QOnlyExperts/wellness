import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { ImplementInputDto } from "../../dtos/implements/ImplementInputDto";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";
import { ImplementUpdateDto } from "../../dtos/implements/ImplementUpdateDto";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/DomainErrors";
import { Transaction } from "sequelize";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";

export class UpdateImplementStatus {
  constructor(private implementRepository: IImplementRepository) {}

  public async execute(
    id: number,
    input: ImplementUpdateDto, // Asumimos que aquí viene el nuevo estado
    t: Transaction
  ): Promise<ImplementOutputDto> {
    // Validación de input
    if (!input || !id || !input.status) {
      throw new ValidationError("Los campos obligatorios están incompletos.");
    }

    const existing = await this.implementRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Implemento no encontrado`);
    }

    // --- 1. INTENTAR LA TRANSICIÓN DE ESTADO (Comando de la Entidad) ---
    try {
      // La entidad valida que la transición sea válida según TODAS las reglas.
      existing.changeStatus(input.status);
    } catch (error) {
      // --- 2. TRADUCIR EL ERROR PARA LA UX ---
      // Si el usuario intenta cambiar el estado A BORROWED
      // y el estado actual ya es BORROWED, personalizamos el mensaje.
      if (
        input.status === ImplementStatus.BORROWED &&
        existing.getStatus() === ImplementStatus.BORROWED
      ) {
        throw new ConflictError(`Implemento se encuentra en uso`);
      }

      // Para todas las demás fallas de transición (ej. RETIRED -> AVAILABLE),
      // lanzamos el error de validación original.
      throw error;
    }

    // --- 3. PERSISTENCIA ---
    // Si no se lanzó ningún error, el estado de la entidad ya se actualizó
    const partialData: Partial<ImplementEntity> = {
      status: existing.getStatus(),
    };

    const updated = await this.implementRepository.updatePartialData(
      id,
      partialData,
      t
    );

    return ImplementMapper.toOutputDto(updated);
  }
}
