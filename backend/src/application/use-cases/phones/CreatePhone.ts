import { IPhoneRepository } from "../../../domain/interfaces/IPhoneRepository";
import { PhoneEntity } from "../../../domain/entities/PhoneEntity";
import { CreatePhoneInputDto } from "../../dtos/phones/CreatePhoneInputDto";
import { PhoneOutputDto } from "../../dtos/phones/PhoneOutputDto";
import { PhoneMapper } from "../../mappers/PhoneMapper";
import { DuplicateNameError, ValidationError } from "../../../shared/errors/DomainErrors"; // Asumiendo que usaremos un error genérico para duplicado

export class CreatePhone {
  constructor(private readonly phoneRepository: IPhoneRepository) {}

  public async execute(input: CreatePhoneInputDto): Promise<PhoneOutputDto> {
    // 1. Convertir el número de entrada a bigint si es necesario (ej: si viene de un JSON)
    const inputNumber = BigInt(input.number);

    // 2. Validar si el número ya existe
    const existingPhone = await this.phoneRepository.findByNumber(inputNumber);
    if (existingPhone) {
      throw new ValidationError(`El número de teléfono ya está registrado.`);
    }

    // 3. Crear la entidad
    const phoneEntity = PhoneEntity.create({
      id: null, // ID es null porque aún no existe en BD
      number: inputNumber,
      info_person_id: input.info_person_id,
    });

    // 4. Guardar en la base de datos
    const createdPhone = await this.phoneRepository.save(phoneEntity);

    // 5. Mapear y devolver el DTO de salida
    return PhoneMapper.toOutputDto(createdPhone);
  }
}