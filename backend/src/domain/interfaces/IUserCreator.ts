import { Transaction } from "sequelize";
import { UserInputDto } from "../../application/dtos/users/UserInputDto"

export interface IUserCreator {
  execute(input: UserInputDto, t: Transaction): Promise<UserInputDto>;
}