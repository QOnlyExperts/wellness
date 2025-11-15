import { IPhoneRepository } from "../../../domain/interfaces/IPhoneRepository";
import { PhoneOutputDto } from "../../dtos/phones/PhoneOutputDto";
import { PhoneMapper } from "../../mappers/PhoneMapper";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";

export class GetPhoneById {
  constructor(private readonly phoneRepository: IPhoneRepository) {}

  public async execute(id: number): Promise<PhoneOutputDto> {
    // Validación de ID
    if (isNaN(id) || id <= 0) {
      throw new ValidationError("El ID del teléfono no es válido.");
    }

    const phone = await this.phoneRepository.findById(id);

    // Si no se encuentra, lanzar un error
    if (!phone) {
      throw new NotFoundError("Teléfono");
    }

    return PhoneMapper.toOutputDto(phone);
  }
}