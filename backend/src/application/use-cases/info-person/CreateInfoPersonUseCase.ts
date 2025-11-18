import { IInfoPersonRepository } from "../../../domain/interfaces/IInfoPersonRepository";
import { InfoPersonEntity } from "../../../domain/entities/InfoPersonEntity";
import { InfoPersonInputDto } from "../../dtos/info-person/InfoPersonInputDto";
import { InfoPersonOutputDto } from "../../dtos/info-person/InfoPersonOutputDto";
import { Transaction } from "sequelize";
import { DomainError, ValidationError } from "../../../shared/errors/DomainErrors";
import { InfoPersonMapper } from "../../mappers/InfoPersonMapper";

export class CreateInfoPersonUseCase {
  constructor(
    private userInfoPersonRepository: IInfoPersonRepository
  ) {}

  public async execute(
    input: InfoPersonInputDto,
    t: Transaction
  ): Promise<InfoPersonOutputDto>{

    if (!input.name1 || !input.last_name1 || !input.identification) {
      throw new ValidationError("Los campos obligatorios están incompletos.");
    }

    const info = InfoPersonEntity.create({
      id: null,
      name1: input.name1,
      name2: input.name2,
      last_name1: input.last_name1,
      last_name2: input.last_name2,
      identification: input.identification,
      program_id: input.program_id
    });

    const createdInfo = await this.userInfoPersonRepository.save(info, t);
    if (!createdInfo) {
      throw new DomainError("No se pudo persistir la información personal en la base de datos.");
    }

    return {
      id: createdInfo.id,
      full_name: createdInfo.getFullName(),
      identification: createdInfo.identification,
      program_id: createdInfo.program_id,
    };
  }
}