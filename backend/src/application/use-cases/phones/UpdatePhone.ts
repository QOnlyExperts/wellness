import { IPhoneRepository } from "../../../domain/interfaces/IPhoneRepository";
import { UpdatePhoneInputDto } from "../../dtos/phones/UpdatePhoneInputDto";
import { PhoneOutputDto } from "../../dtos/phones/PhoneOutputDto";
import { PhoneMapper } from "../../mappers/PhoneMapper";
import { ValidationError, NotFoundError } from "../../../shared/errors/DomainErrors";

export class UpdatePhone {
  constructor(private readonly phoneRepository: IPhoneRepository) {}

  public async execute(
    id: number,
    input: UpdatePhoneInputDto
  ): Promise<PhoneOutputDto> {
    
    // 1. Validar que el ID exista
    const existingPhone = await this.phoneRepository.findById(id);
    if (!existingPhone) {
      throw new NotFoundError("Teléfono");
    }

    // 2. Validar si el nuevo número ya existe en OTRO teléfono
    if (input.number) {
      const inputNumber = BigInt(input.number);
      const phoneWithSameNumber = await this.phoneRepository.findByNumber(inputNumber);
      if (phoneWithSameNumber && phoneWithSameNumber.id !== id) {
        throw new ValidationError(`El número de teléfono ya está registrado.`);
      }
    }

    // 3. Aplicar campos opcionales uno por uno (Patrón de corrección)
    if (input.number !== undefined) {
      existingPhone.number = BigInt(input.number);
    }
    if (input.info_person_id !== undefined) {
      existingPhone.info_person_id = input.info_person_id;
    }

    // 4. Guardar la entidad actualizada
    const updatedPhone = await this.phoneRepository.save(existingPhone);

    // 5. Mapear a DTO de salida
    return PhoneMapper.toOutputDto(updatedPhone);
  }
}