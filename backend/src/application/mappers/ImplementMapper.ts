import { ImplementEntity } from '../../domain/entities/ImplementEntity';
import { ImplementOutputDto } from '../dtos/implements/ImplementOutputDto';

export class ImplementMapper {
  // Mapea la Entidad (objeto rico en lógica) a un DTO (objeto plano para transporte)
  public static toOutputDto(implement: ImplementEntity): ImplementOutputDto {
    return {
      id: implement.id,
      cod: implement.cod, // Mantener el nombre si es necesario o cambiarlo
      status: implement.status,
      condition: implement.condition,
    };
  }
}