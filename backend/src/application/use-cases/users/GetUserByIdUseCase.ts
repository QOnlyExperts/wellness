import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserEntity } from "../../../domain/entities/UserEntity";
import { DomainError, ValidationError } from "../../../shared/errors/DomainErrors";
import { UserMapper } from "../../mappers/UserMapper";
import { UserOutputDto } from "../../dtos/users/UserOutputDto";

export class GetUserByIdUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  public async execute(
    id: number,
  ): Promise<UserOutputDto> {
    // Validación minima para verificar que el ID es un numero positivo
    if (isNaN(id) || id <= 0) {
      throw new ValidationError("ID inválido.");
    }

    console.log(id);
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new DomainError("Usuario no encontrado");
    }
    return UserMapper.toOutputDto(user);
  }
}