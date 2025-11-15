import { IPhoneRepository } from "../../../domain/interfaces/IPhoneRepository";
import { PhoneOutputDto } from "../../dtos/phones/PhoneOutputDto";
import { PhoneMapper } from "../../mappers/PhoneMapper";
import { PhoneEntity } from "../../../domain/entities/PhoneEntity";

export class GetPhones {
  constructor(private readonly phoneRepository: IPhoneRepository) {}

  public async execute(): Promise<PhoneOutputDto[]> {
    const phoneList: PhoneEntity[] = await this.phoneRepository.findAll();

    // Mapear cada entidad al DTO de salida
    return phoneList.map((entity) => PhoneMapper.toOutputDto(entity));
  }
}