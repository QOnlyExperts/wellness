import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { IImplementCounterPort } from "../../ports/IImplementCounterPort";

import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { ImplementStatus } from "../../../domain/enums/ImplementStatus";
import { ImplementCondition } from "../../../domain/enums/ImplementCondition";

import { ImplementInputDto } from "../../dtos/implements/ImplementInputDto";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";

export class CreateImplement {
  constructor(
    private implementRepository: IImplementRepository,
    private counterPort: IImplementCounterPort
  ) {}

  // Función auxiliar para formatear el número
  private formatCode(prefix: string, number: number): string {
    // Ejemplo: PadStart para rellenar con ceros (ej. 1 -> 001)
    const paddedNumber = String(number).padStart(3, "0");
    return `${prefix}${paddedNumber}`;
  }

  public async execute(
    input: ImplementInputDto
  ): Promise<ImplementOutputDto> {
    // Obtener el siguiente numero consecutivo
    const nextNumber = await this.counterPort.getNextNumber(input.prefix);
    if (nextNumber == null || isNaN(nextNumber)) {
      throw new Error("Invalid counter value");
    }
    // Generamos el código final prefix + numero
    const finalCod = this.formatCode(input.prefix, nextNumber);

    // Crear Entidad Pura sin ID
    const newImplement = ImplementEntity.create({
      id: null, // ID es null porque aún no existe en BD
      cod: finalCod,
      // Valores por defecto
      status: input.status || ImplementStatus.AVAILABLE,
      condition: input.condition || ImplementCondition.NEW,
      group_implement_id: input.group_implement_id,
      categories_id: input.categories_id
    });

    // Guardamos la entidad en base de datos
    const createdImplement = await this.implementRepository.save(newImplement);

    // Mapeamos el modelo guardado a un DTO de salida
    return ImplementMapper.toOutputDto(createdImplement);
  }
}
