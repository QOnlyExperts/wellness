import bcrypt from 'bcrypt';


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
    // Encriptamos la contraseña
    // Al crear usuario
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds); // Salt aleatorio único por usuario
    const password = await bcrypt.hash(input.password, salt);

    const user = UserEntity.create({
      id: null,
      email: input.email,
      password: password,
      salt: salt,
      is_verified: input.is_verified ?? false,
      is_active: input.is_active ?? false,
      created_at: input.created_at ?? new Date(),
      updated_at: input.updated_at ?? new Date(),
      last_login: input.last_login ?? new Date(),
      info_person_id: 1,
      rol_id: 1,
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