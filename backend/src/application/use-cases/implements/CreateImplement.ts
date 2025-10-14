import { IImplementRepository } from '../../../domain/interfaces/IImplementRepository';
import { IImplementCounterPort } from '../../ports/IImplementCounterPort';

import { ImplementEntity } from '../../../domain/entities/ImplementEntity'; 
import { ImplementStatus } from '../../../domain/enums/ImplementStatus';
import { ImplementCondition } from '../../../domain/enums/ImplementCondition';

import { CreateImplementInputDto } from '../../dtos/implements/CreateImplement.input';

export class CreateImplement {
  constructor(
    private implementRepository: IImplementRepository,
    private counterPort: IImplementCounterPort
  ) {}

  // Función auxiliar para formatear el número
  private formatCode(prefix: string, number: number): string {
      // Ejemplo: PadStart para rellenar con ceros (ej. 1 -> 001)
      const paddedNumber = String(number).padStart(3, '0'); 
      return `${prefix}${paddedNumber}`;
  }

  public async execute(input: CreateImplementInputDto): Promise<ImplementEntity> {
    // Obtener el siguiente numero consecutivo
    const nextNumber = await this.counterPort.getNextNumber(input.prefix);
    if (nextNumber == null || isNaN(nextNumber)) {
      throw new Error('Invalid counter value');
    }
    // Generamos el código final prefix + numero
    const finalCod = this.formatCode(input.prefix, nextNumber);

    // Crear Entidad Pura sin ID
    const newImplement = new ImplementEntity(
      null, // ID es null porque aún no existe en BD
      finalCod,
      // Valores por defecto
      input.status || ImplementStatus.AVAILABLE,
      input.condition || ImplementCondition.NEW,
      input.group_implement_id,
      input.categories_id
    );

    // Usar el Contrato (IImplementRepository)
    // Guardamos
    return await this.implementRepository.save(newImplement);

  }
}