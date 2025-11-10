import { Transaction } from "sequelize";
import { IInfoPersonCreator } from "../../../../domain/interfaces/IInfoPersonCreator";
import { IUserCreator } from "../../../../domain/interfaces/IUserCreator";
import { UserInputDto } from "../../../dtos/users/UserInputDto";
import { UserOutputDto } from "../../../dtos/users/UserOutputDto";
import db from "../../../../infrastructure/database/db";

export class RegisterUseCase {

  constructor(
    private readonly userCreator: IUserCreator,
    private readonly infoPersonCreator: IInfoPersonCreator
  ) {}


  async execute(input: UserInputDto): Promise<UserOutputDto> {
    
    const t: Transaction = await db.transaction();

    const user = await this.userCreator.execute(input)
  }
}