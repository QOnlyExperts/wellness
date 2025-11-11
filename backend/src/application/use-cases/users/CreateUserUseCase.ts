import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

import { UserEntity } from "../../../domain/entities/UserEntity";

import { UserInputDto } from "../../dtos/users/UserInputDto";
import { UserOutputDto } from "../../dtos/users/UserOutputDto";

import { Transaction } from "sequelize";
import { InfoPersonEntity } from "../../../domain/entities/InfoPersonEntity";
import { ValidationError } from "../../../shared/errors/DomainErrors";
import { UserMapper } from "../../mappers/UserMapper";
// import

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  public async execute(
    input: UserInputDto,
    t: Transaction
  ): Promise<UserOutputDto> {

    const user = UserEntity.create({
      id: null,
      email: input.email,
      password: input.password,
      salt: input.salt,
      is_verified: false,
      is_active: false,
      created_at: new Date(),
      updated_at: new Date(),
      last_login: new Date(),
      info_person_id: input.info_person_id,
      rol_id: input.rol_id,
    });
    // user.verifyEmail();

    // Pasamos el usuario creado y la transacción
    const createdUser = await this.userRepository.save(user, t);
    if (!createdUser) {
      throw new ValidationError("No se pudo crear el usuario");
    }

    // Retornamos con el dto de salida
    return UserMapper.toOutputDto(createdUser);
  }
}