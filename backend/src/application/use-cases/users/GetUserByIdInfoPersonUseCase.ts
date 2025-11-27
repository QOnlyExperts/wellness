import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserEntity } from "../../../domain/entities/UserEntity";
import { DomainError, ValidationError } from "../../../shared/errors/DomainErrors";
import { UserMapper } from "../../mappers/UserMapper";
import { UserIdOutputDto } from "../../dtos/users/UserIdOutputDto";

export class GetUserByIdInfoPersonUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  public async execute(
    id: number,
  ): Promise<UserIdOutputDto> {
    // Validación minima para verificar que el ID es un numero positivo
    if (isNaN(id) || id <= 0) {
      throw new ValidationError("ID inválido.");
    }

    const user = await this.userRepository.findByIdInfoPerson(id);
    if (!user || !user.id) {
      throw new DomainError("Información personal no encontrada");
    }
    
    return {
      user_id: user.id
    };
  }
}