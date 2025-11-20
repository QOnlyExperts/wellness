import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserEntity } from "../../../domain/entities/UserEntity";
import { DomainError, ValidationError } from "../../../shared/errors/DomainErrors";
import { UserMapper } from "../../mappers/UserMapper";
import { UserOutputDto } from "../../dtos/users/UserOutputDto";

export class GetUsersUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  public async execute(): Promise<UserOutputDto[]> {

    const userList: UserEntity[] = await this.userRepository.findAll();
    if (!userList) {
      throw new DomainError("Usuarios no encontrados");
    }

    return userList.map((user) => UserMapper.toOutputDto(user));
  }
}