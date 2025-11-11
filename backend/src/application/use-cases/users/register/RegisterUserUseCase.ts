import bcrypt from 'bcrypt';

import { Transaction } from "sequelize";
import { IInfoPersonCreator } from "../../../../domain/interfaces/IInfoPersonCreator";
import { IUserCreator } from "../../../../domain/interfaces/IUserCreator";
import { UserInputDto } from "../../../dtos/users/UserInputDto";
import { UserOutputDto } from "../../../dtos/users/UserOutputDto";
import db from "../../../../infrastructure/database/db";
import { RegisterUserInputDto } from "../../../dtos/users/register/RegisterUserInputDto";
import { RegisterUserOutputDto } from "../../../dtos/users/register/RegisterUserOutputDto";

export class RegisterUseCase {

  constructor(
    private readonly userCreator: IUserCreator,
    private readonly infoPersonCreator: IInfoPersonCreator
  ) {}


  async execute(input: RegisterUserInputDto): Promise<void> {
    const t: Transaction = await db.transaction();

    const info = await this.infoPersonCreator.execute(
      {
        id: null,
        name1: input.name1,
        name2: input.name2,
        last_name1: input.last_name1,
        last_name2: input.last_name2,
        identification: input.identification,
        program_id: input.program_id,
      },
      t
    );

    // Encriptamos la contraseña
    // Al crear usuario
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds); // Salt aleatorio único por usuario
    const hashedPassword = await bcrypt.hash(input.password, salt);

    // Creamos el usuario
    const user = await this.userCreator.execute({
        id: null,
        email: input.email,
        password: hashedPassword,
        salt: salt,
        info_person_id: 1,
        rol_id: 1,
      },
      t
    );
  }
}