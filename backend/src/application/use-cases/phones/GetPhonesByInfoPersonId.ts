import { IPhoneRepository } from "../../../domain/interfaces/IPhoneRepository";
import { PhoneOutputDto } from "../../dtos/phones/PhoneOutputDto";
import { PhoneMapper } from "../../mappers/PhoneMapper";
import { NotFoundError, ValidationError } from "../../../shared/errors/DomainErrors";

export class GetPhonesByInfoPersonId {
  constructor(private readonly phoneRepository: IPhoneRepository) {}

  public async execute(infoPersonId: number): Promise<PhoneOutputDto[]> {
    // Validación de ID
    if (isNaN(infoPersonId) || infoPersonId <= 0) {
      throw new ValidationError("El ID de la persona no es válido.");
    }

    const phones = await this.phoneRepository.findByInfoPersonId(infoPersonId);

   
    return phones.map((entity) => PhoneMapper.toOutputDto(entity));
  }
}