import bcrypt from 'bcrypt';

import { Transaction } from "sequelize";
import { IInfoPersonCreator } from "../../../../domain/interfaces/IInfoPersonCreator";
import { IUserCreator } from "../../../../domain/interfaces/IUserCreator";
import { UserInputDto } from "../../../dtos/users/UserInputDto";
import { UserOutputDto } from "../../../dtos/users/UserOutputDto";
import { RegisterUserInputDto } from "../../../dtos/users/register/RegisterUserInputDto";
import { RegisterUserOutputDto } from "../../../dtos/users/register/RegisterUserOutputDto";
import { IHashService } from '../../../../domain/interfaces/services/IHashService';
import { IEmailService } from '../../../../domain/interfaces/services/IEmailServer';
import { IJwtService } from '../../../../domain/interfaces/services/IJwtService';
import db from '../../../../infrastructure/database/db';
import { ValidationError } from '../../../../shared/errors/DomainErrors';

export class RegisterUserUseCase {

  constructor(
    private readonly userCreator: IUserCreator,
    private readonly infoPersonCreator: IInfoPersonCreator,
    private readonly hashService: IHashService,
    private readonly emailService: IEmailService,
    private readonly jwtService: IJwtService
  ) {}


  async execute(input: RegisterUserInputDto): Promise<void> {

    const t: Transaction = await db.transaction();

    try{
      
      if (input.password.length < 8 || input.password.length > 16) {
        throw new ValidationError("La contraseña debe tener entre 8 y 16 caracteres");
      }

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
      const hashedPassword = await this.hashService.hash(input.password);
      const salt = await this.hashService.salt();
      console.log(info.id);
      // Creamos el usuario
      await this.userCreator.execute({
          id: null,
          email: input.email,
          password: hashedPassword,
          salt: salt,
          info_person_id: info.id!, // id garantizado tras persistencia
          rol_id: 1,
        },
        t
      );

      // Verificación de email
      // await this.emailService.sendVerification(input.email);

      await t.commit();
    }catch(e) {
      await t.rollback();
      throw e;
    }

  }
}